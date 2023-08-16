-- Création de la base de données
CREATE DATABASE yamgenotyping;

-- Utilisation de la base de données
\c yamgenotyping;

-- Table Espece
CREATE TABLE Espece (
    id SERIAL PRIMARY KEY,
    nom_espece VARCHAR(255),
    pays_origine VARCHAR(255),
    disponibilite VARCHAR(255)
);

-- Table Lot
CREATE TABLE Lot (
    id SERIAL PRIMARY KEY,
    espece_id INT REFERENCES Espece(id),
    autres_attributs_lot VARCHAR(255)
);

-- Table Varietes
CREATE TABLE Varietes (
    id SERIAL PRIMARY KEY,
    lot_id INT REFERENCES Lot(id),
    nom_accession VARCHAR(255),
    mere VARCHAR(255),
    pere VARCHAR(255),
    nombre_tubercules_par_plante INT,
    longueur_tubercule VARCHAR(255),
    largeur_tubercule VARCHAR(255),
    racine_epineuse BOOLEAN,
    racine_sur_tubercule BOOLEAN,
    epines_sur_racine BOOLEAN,
    nombre_recoltes_par_cycle INT,
    largeur_feuille VARCHAR(255),
    longueur_feuille VARCHAR(255),
    longueur_petiole VARCHAR(255),
    profondeur_sinus VARCHAR(255),
    distance_lobe_base VARCHAR(255),
    pruine BOOLEAN,
    epines_sur_tige BOOLEAN,
    poils BOOLEAN,
    section_transversale VARCHAR(255)
);

-- Table PhotosVarietes
CREATE TABLE PhotosVarietes (
    id SERIAL PRIMARY KEY,
    variete_id INT REFERENCES Varietes(id),
    photo_bytea  VARCHAR(255),
    description TEXT
);

-- Table Origine
CREATE TABLE Origine (
    variete_id INT REFERENCES Varietes(id),
    pays_origine VARCHAR(255),
    organisme_origine VARCHAR(255),
    sain_potyvirus VARCHAR(255),
    sain_potexvirus VARCHAR(255),
    sain_badnavirus VARCHAR(255)
);

-- Table Conservation
CREATE TABLE Conservation (
    variete_id INT REFERENCES Varietes(id),
    mode_conservation VARCHAR(255),
    lieu_conservation VARCHAR(255)
);

-- Table Reglementation
CREATE TABLE Reglementation (
    variete_id INT REFERENCES Varietes(id),
    organisme_proprietaire VARCHAR(255),
    plante_protegee_obtention_varietale BOOLEAN,
    materiel_importe_avant_1993 BOOLEAN,
    pays_fournisseur VARCHAR(255),
    organisme_fournisseur VARCHAR(255),
    pays_beneficiaire VARCHAR(255),
    organisme_beneficiaire VARCHAR(255),
    utilisation_autorisee_autre_que_recherche VARCHAR(255),
    proprietaire_resultats_recherche VARCHAR(255),
    disponibilite VARCHAR(255)
);

-- Table CaracterisationGenetique
CREATE TABLE CaracterisationGenetique (
    variete_id INT REFERENCES Varietes(id),
    niveau_chromosomique_base VARCHAR(255),
    niveau_ploidie VARCHAR(255)
);

-- Table AdminUsers
CREATE TABLE AdminUsers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255)
);
