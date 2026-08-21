(()=>{
  const DB_NAME='ichizen-local';
  const DB_VERSION=1;
  const STORE='kv';
  const STATE_KEY='ichizen-state-v4';
  const RECORD_KEY='app-state';

  function openDb(){
    return new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'key'});
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error||new Error('IndexedDB open failed'));
    });
  }

  async function readRecord(){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(RECORD_KEY);
      req.onsuccess=()=>resolve(req.result?.value||null);
      req.onerror=()=>reject(req.error||new Error('IndexedDB read failed'));
      tx.oncomplete=()=>db.close();
    });
  }

  async function writeRecord(value){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put({key:RECORD_KEY,value,updatedAt:new Date().toISOString(),schemaVersion:1});
      tx.oncomplete=()=>{db.close();resolve();};
      tx.onerror=()=>{db.close();reject(tx.error||new Error('IndexedDB write failed'));};
    });
  }

  function parseLocal(){
    try{
      const raw=localStorage.getItem(STATE_KEY);
      return raw?JSON.parse(raw):null;
    }catch{return null;}
  }

  async function restoreOrSeed(){
    try{
      const local=parseLocal();
      const dbState=await readRecord();
      if(!local&&dbState){
        localStorage.setItem(STATE_KEY,JSON.stringify(dbState));
        if(!sessionStorage.getItem('ichizen-db-restored')){
          sessionStorage.setItem('ichizen-db-restored','1');
          location.reload();
        }
        return;
      }
      if(local) await writeRecord(local);
    }catch(err){
      console.warn('ICHIZEN local database unavailable; continuing with localStorage fallback.',err);
    }
  }

  let lastSerialized='';
  async function mirrorIfChanged(){
    const local=parseLocal();
    if(!local) return;
    const serialized=JSON.stringify(local);
    if(serialized===lastSerialized) return;
    lastSerialized=serialized;
    try{await writeRecord(local);}catch(err){console.warn('ICHIZEN local database mirror failed.',err);}
  }

  window.ICHIZENLocalDB={
    read:readRecord,
    write:writeRecord,
    sync:mirrorIfChanged,
    info:()=>({database:DB_NAME,store:STORE,stateKey:STATE_KEY,schemaVersion:1})
  };

  if(navigator.storage?.persist){
    navigator.storage.persist().catch(()=>{});
  }

  restoreOrSeed().finally(()=>{
    mirrorIfChanged();
    setInterval(mirrorIfChanged,1000);
    document.addEventListener('visibilitychange',()=>{if(document.hidden) mirrorIfChanged();});
    window.addEventListener('pagehide',mirrorIfChanged);
  });
})();
