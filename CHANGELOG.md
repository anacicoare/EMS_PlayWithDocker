# Changelog

Toate modificările notabile aduse acestui proiect vor fi documentate aici.

Formatul respectă [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
și folosim [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Contribuitori: Cicoare Ana Maria 341C5 și Popa Răzvan Mihai 341C5.

## [Unreleased]

### Added
- Adăugare Dockerfile pentru business_module, payments_module, tasks_module și teams_module
pe porturile 8002, 8003, 8004, 8000 și push imagini pe Docker Hub.
- Task-uri făcute: existența și integrarea celor minim 3 servicii proprii, existența și integrarea unui serviciu de baze de date,
existența și integrarea unui serviciu de utilitar DB (phpmyadmin), existența și integrarea Portainer
- Task-uri începute: utilizarea Docker și rularea într-un cluster Docker Swarm, existența și integrarea Kong

---

## [1.0.1] - 2025-03-27

### Added
- Început configurare serviciu Kong și configurarea fișierului kong.yml
- Adăugare serviciu Portainer pentru administrarea unui Docker Swarm
- Creare docker swarm folosind **docker swarm init** și **docker stack deploy -c docker-compose.yml ems**
- Integrarea unui utilitar pentru mysql, mai exact phpmyadmin cu docker
- Crearea unui docker-compose.yml pentru baza de date, frontend și backend
- Crearea de fișiere Dockerfile pentru componentele de frontend și backend
- Segmentarea codului de backend in 4 module: business logic, teams, tasks, payments
- Realizarea dependintelor intre cele 4 module pentru partea de business logic
- Rezolvarea conflictelor pe migrari la baza de date

### Fixed 
- Actualizarea tipurilor variabilelor din typescript pentru un build corect.

### Changed
- Modificare docker-compose.yml pentru Docker Swarm și publicarea imaginii razvim23/frontend-image pe contul meu de Docker Hub
- Trecerea de la rulare locală manuală la rulare în container Docker
- Actualizat scripturile `package.json` pentru rulare cu `npm start -p 4000` după build

## [1.0.0] - 2025-03-25

### Added
- Inițializarea proiectului.
- Setup Next.js + Node 18.
