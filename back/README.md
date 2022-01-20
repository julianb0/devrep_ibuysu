# Back - iBuySU

## Exigences

- OpenJDK 17 (https://jdk.java.net/17/)
- Maven (https://maven.apache.org/)
- Mysql (https://www.mysql.com/)

## Exécuter

```sh
cd back
```

- Durant la phase de développement, afin de pouvoir effectuer le reverse engineering, nous devons conserver les `@objid ("...")` de modelio et donc rajouter `./libs/javadesigner.jar` aux dépendances du projet afin de lancer l'application.
- Créer une base de données MYSQl (ibuysu).
- Ajouter vos identifiants de connection dans `./src/main/ressources/application.properties`.

```sh
mvn spring-boot:run
```

## Génération du code

### Exigences

- Modelio (https://www.modelio.org/)

### Application

Dans le dossier `./modelio` vous trouverez le zip du projet uml à dézipper dans le workspace modelio. 

Une fois que cela est fait,
- Ouvrez Modelio;
- Ouvrez le projet (iBuySU);
- Ajoutez `./modelio/rt.jar` dans la configuration du module du java designer (configuration -> modules -> Java Designer -> Général -> Classes accessibles (classpath)). 


#### Pour ajouter de nouveaux paquets dans le rt.jar

- Dézipper `./modelio/rt.jar` dans `./modelio`;
- `cd ./modelio/rt`;
- Ajoutez vos paquets dans le dossier;
- `jar cvf ../rt.jar *`.
