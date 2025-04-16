
### Viktigt

0. Lägg till följande i mappen config:
   ca.pem   pgConnect.json

   Lägg till följande i database:
   .env

   (Se till att den verkligen heter .env)

   I och med att dessa innehåller känslig info om databasen
   så kommer de att ignoreras vid varje commit, alltså behöver
   man lägga till dem varje gång man hämtar hem repo:t på nytt :(

### Övergripande info

0. Databastabellerna finns under 
   "databases => defaultdb => schemas => public => tables"

0. pgAdmin används för att hantera databasen manuellt

0. Databasen ligger vid tillfället på molnet (Frankfurt) hos "aiven"
   
0. Vi har totalt 5gb att jobba med

0. Exempel på hur man sätter in och hämtar data
   finns i exempelfilerna.

### För att komma igång

0. Kör "npm install" i server.
   Detta hämtar hem eventuella saknade moduler definierade i package.json.

1. Ladda ned PostgreSQL. Vid installationen bör du kryssa ned rutan när du får möjligheten att välja vilka packages som ska ingå.

2. Öppna upp pgAdmin som bör ha följt med vid installationen.
   pgAdmin är själva programvaran vi kommer att använda för
   att hantera databasen manuellt.

3. Ladda ned filen "pgConnect.json" lokalt.
   Filen ligger under "database" här i repo:t.

4. Anslut till databasen genom 
   "Tools => import/export server => välj att importera pgConnect.json => next => bocka i "group_test" => finnish".

5. Nu har du databasen!
   När du går in i "group_test" kommer du dock behöva fylla in ett lösenord. Denna finns i .env-filen.