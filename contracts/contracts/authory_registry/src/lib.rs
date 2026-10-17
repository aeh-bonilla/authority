#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Env, String, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    WorkAlreadyRegistered = 1,
    WorkNotFound = 2,
    EventAlreadyExists = 3,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WorkRecord {
    pub work_id: String,
    pub hash: String,
    pub author: String,
    pub registered_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RightsEventRecord {
    pub work_id: String,
    pub event_id: String,
    pub event_type: String,     // "license" | "assignment"
    pub actor: String,          // Titular o cedente
    pub recipient: String,      // Beneficiario o cesionario
    pub terms: String,          // Términos o alcance
    pub effective_date: String, // Fecha de efectividad / vigencia
    pub recorded_at: u64,       // Timestamp del ledger
}

#[contracttype]
pub enum DataKey {
    Work(String),
    RightsEvents(String),
}

#[contract]
pub struct AuthoryRegistryContract;

#[contractimpl]
impl AuthoryRegistryContract {
    /// Registra la huella digital inicial de una obra, vinculando su identificador
    /// con el autor y la estampa de tiempo del ledger de Stellar.
    pub fn register_work(
        env: Env,
        work_id: String,
        hash: String,
        author: String,
    ) -> Result<WorkRecord, Error> {
        let key = DataKey::Work(work_id.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::WorkAlreadyRegistered);
        }

        let registered_at = env.ledger().timestamp();
        let record = WorkRecord {
            work_id: work_id.clone(),
            hash: hash.clone(),
            author: author.clone(),
            registered_at,
        };

        env.storage().persistent().set(&key, &record);

        // Publicar evento en Soroban para indexación y auditoría pública
        env.events().publish(
            (symbol_short!("work_reg"), work_id),
            (hash, author, registered_at),
        );

        Ok(record)
    }

    /// Añade un evento auditable de derechos (licencia de uso o cesión patrimonial)
    /// vinculado al histórico de la obra.
    pub fn record_rights_event(
        env: Env,
        work_id: String,
        event_id: String,
        event_type: String,
        actor: String,
        recipient: String,
        terms: String,
        effective_date: String,
    ) -> Result<RightsEventRecord, Error> {
        let work_key = DataKey::Work(work_id.clone());
        if !env.storage().persistent().has(&work_key) {
            return Err(Error::WorkNotFound);
        }

        let events_key = DataKey::RightsEvents(work_id.clone());
        let mut events: Vec<RightsEventRecord> = env
            .storage()
            .persistent()
            .get(&events_key)
            .unwrap_or_else(|| Vec::new(&env));

        // Verificar que no se duplique event_id
        for i in 0..events.len() {
            if let Some(existing) = events.get(i) {
                if existing.event_id == event_id {
                    return Err(Error::EventAlreadyExists);
                }
            }
        }

        let recorded_at = env.ledger().timestamp();
        let event_record = RightsEventRecord {
            work_id: work_id.clone(),
            event_id: event_id.clone(),
            event_type: event_type.clone(),
            actor: actor.clone(),
            recipient: recipient.clone(),
            terms: terms.clone(),
            effective_date: effective_date.clone(),
            recorded_at,
        };

        events.push_back(event_record.clone());
        env.storage().persistent().set(&events_key, &events);

        // Publicar evento en Soroban
        env.events().publish(
            (symbol_short!("right_evt"), work_id),
            (event_id, event_type, actor, recipient, recorded_at),
        );

        Ok(event_record)
    }

    /// Consulta el registro de una obra por su ID.
    pub fn get_work(env: Env, work_id: String) -> Option<WorkRecord> {
        let key = DataKey::Work(work_id);
        env.storage().persistent().get(&key)
    }

    /// Consulta todos los eventos de derechos vinculados a una obra.
    pub fn get_rights_events(env: Env, work_id: String) -> Vec<RightsEventRecord> {
        let key = DataKey::RightsEvents(work_id);
        env.storage().persistent().get(&key).unwrap_or_else(|| Vec::new(&env))
    }

    /// Verifica si una obra está registrada y coincide con el hash suministrado.
    pub fn verify_work(env: Env, work_id: String, hash: String) -> bool {
        let key = DataKey::Work(work_id);
        match env.storage().persistent().get::<DataKey, WorkRecord>(&key) {
            Some(record) => record.hash == hash,
            None => false,
        }
    }
}

mod test;
