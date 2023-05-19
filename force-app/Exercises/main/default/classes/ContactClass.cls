public with sharing class ContactClass {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String firstLetter) {
        List<Contact> myContacts;
        if (String.isEmpty(firstLetter)) {
            myContacts = [SELECT Id, Name, Email, Phone
            FROM Contact
            WHERE NAME LIKE 'A%'
            WITH SECURITY_ENFORCED
            ORDER BY Name];
        } 
        else {
            String filterVar = firstLetter + '%';
            myContacts = [
            SELECT Id, Name, Email, Phone
            FROM Contact
            WHERE Name LIKE :filterVar
            WITH SECURITY_ENFORCED
            ORDER BY Name];
        }
        return myContacts;
    }
}