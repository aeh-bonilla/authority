#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String};

#[test]
fn test_register_and_get_work() {
    let env = Env::default();
    let contract_id = env.register(AuthoryRegistryContract, ());
    let client = AuthoryRegistryContractClient::new(&env, &contract_id);

    let work_id = String::from_str(&env, "AUTH-2026-000001");
    let hash = String::from_str(
        &env,
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
    let author = String::from_str(&env, "Alain Bonilla");

    let record = client.register_work(&work_id, &hash, &author);
    assert_eq!(record.work_id, work_id);
    assert_eq!(record.hash, hash);
    assert_eq!(record.author, author);

    let retrieved = client.get_work(&work_id);
    assert!(retrieved.is_some());
    let retrieved_record = retrieved.unwrap();
    assert_eq!(retrieved_record.work_id, work_id);
    assert_eq!(retrieved_record.hash, hash);

    // Verify work
    let is_valid = client.verify_work(&work_id, &hash);
    assert!(is_valid);

    let wrong_hash = String::from_str(&env, "0000000000000000000000000000000000000000000000000000000000000000");
    assert!(!client.verify_work(&work_id, &wrong_hash));
}

#[test]
fn test_duplicate_registration_fails() {
    let env = Env::default();
    let contract_id = env.register(AuthoryRegistryContract, ());
    let client = AuthoryRegistryContractClient::new(&env, &contract_id);

    let work_id = String::from_str(&env, "AUTH-2026-000002");
    let hash = String::from_str(&env, "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890");
    let author = String::from_str(&env, "Daniela Ramírez");

    let res1 = client.try_register_work(&work_id, &hash, &author);
    assert!(res1.is_ok());

    let res2 = client.try_register_work(&work_id, &hash, &author);
    assert_eq!(res2, Err(Ok(Error::WorkAlreadyRegistered)));
}

#[test]
fn test_record_and_get_rights_events() {
    let env = Env::default();
    let contract_id = env.register(AuthoryRegistryContract, ());
    let client = AuthoryRegistryContractClient::new(&env, &contract_id);

    let work_id = String::from_str(&env, "AUTH-2026-000003");
    let hash = String::from_str(&env, "1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff");
    let author = String::from_str(&env, "Selene Escalona");

    // Must register work first
    client.register_work(&work_id, &hash, &author);

    let event_id = String::from_str(&env, "EVT-2026-001");
    let event_type = String::from_str(&env, "license");
    let actor = String::from_str(&env, "Selene Escalona");
    let recipient = String::from_str(&env, "Empresa Editorial X");
    let terms = String::from_str(&env, "Licencia no exclusiva de distribución digital en LATAM");
    let effective_date = String::from_str(&env, "2026-10-16");

    let event_record = client.record_rights_event(
        &work_id,
        &event_id,
        &event_type,
        &actor,
        &recipient,
        &terms,
        &effective_date,
    );

    assert_eq!(event_record.event_id, event_id);
    assert_eq!(event_record.event_type, event_type);

    let events = client.get_rights_events(&work_id);
    assert_eq!(events.len(), 1);
    let first = events.get(0).unwrap();
    assert_eq!(first.event_id, event_id);
    assert_eq!(first.recipient, recipient);
}
