# modularni-urad "podvozek"

Obalujici node.js aplikace pro modularni API aplikace (api moduly).
Obstarava api modulum spolecnou agendu vcetne [multitenant fungovani](https://en.wikipedia.org/wiki/Multitenancy):
- Nacita configuracni yaml soubory s nastavenim pro jednotlive tenants (orgsettings).
Dela autoreload pri jejich zmene.
- Inicializuje a spousti migrace DB
- Resi CORS
- Resi Autentikaci

![Schema](http://www.plantuml.com/plantuml/img/PLDBRjim4Dtp50DfqoxiEbaKQ1T5Z2Ggt2Qr6nlm8kY25KSA4OeZa9IJkF4HUgiUB1Gf2RBBXIJEl3UVDwCBwxXnJQMOaquXL2GQnOsMayPm0VFLWh5SKIDWeHqQZQw_9rjfy6l3ZO1SDTOx4_Z303G9X4INKZz3RUZv9G5kGUhIeBK10N3Vfl7nf-HmPr3p2dqTqtp_gyNgSbvBZpiCqNWjmQBPzJbwUqrYHtjyJ22TVxgwlCewBq1ELKqQjVFanZr09OLG-CGDXd9Qs-tsVwppjVXtJhgGvIafEY-BSc3MF7_afIzavKMK-VIEzZNz-uiku6jk2DBPBCjciq0uX6T1Ig0voMMFCsGHqtTJI3-Qf6eS_qrc-i8h1UyYzkpzY7W6AVUdozRJA8exPfsFMUUGVlJdgCOexxVjPks79adVSktxD85bemdIjg_0QZc2--AuRRKWw_omrpzleWhnsWhHIj7rP1sPe9pD7x3YqFMM77Lm2egT9ADw3-p0MB-PC17qf2TV-cLZB6pIO1xFR_Gz-BkbYA_1sawHXL4EbjWHOwVZcfYJB7qeXONpha6vk1EVORLSR-33ZYlfvKFOBBzV_s0zAaJh8WmCrBaVZO3LtJ9Rt5p3Aw0nPDW5Qk7_uZS0)

Veskera sprava ze strany tenant admina = editace prislusneho yaml souboru (tj. zadny zasah ze strany infrastructure admina).
Tenant admin = typicky pracovnik IT te dane organizace, v nasem pripade prevazne samospravy.

V obrazku jsou 2 tenanti (mutabor a omesta):
- Kazdy tenant ma svuj konfiguracni soubor _tenantid_.yaml = tenantconfig (napr. omesta.yaml).
- Kazdy tenant ma k dispozici svuj url prefix na spolecne domene = tenanturl. Napr. [https://modurad.otevrenamesta.cz/omesta/...](https://modurad.otevrenamesta.cz/omesta/uni/posts/?sort=title:asc&currentPage=1&perPage=10).
- Kazdy api modul si cte ruzne casti v tenantconfig (pokud existuji, jinak error 404).

Na obrazku jsou dalsi komponenty (nemusi nutne bezet na stejnem stroji):
- JWTSession manager: komponenta, ktera vytvari/overuje JWT tokeny, pres ktere je resena autentikace.
- Postgre DB

## SETTINGS

Globalni nastaveni aplikace pouze pomocí ENVIRONMENT VARIABLES.

TBD ...

### Update zavislosti - bude nahrazeno managementem pres npm

```
git submodule update --remote --merge
```

#### init zavislosti

pouze v pripade vyclonovaneho repo

```
git submodule init
```
