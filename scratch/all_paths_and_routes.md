# 🎓 SkillItLearn — Master Curriculum, Routes & End Learnings Catalog

This document lists every application route, career domain, learning path, and skill booklet with their exact URLs and learning outcomes.

## 🌐 1. Application Core & Operational Routes

| Route / URL | Type | Access | Description |
|---|---|---|---|
| / | Static / ISR | Public | Homepage with Career Explorer, Hero, Stats, Testimonials |
| /about | Static | Public | Platform philosophy, structured learning methodology |
| /login | Dynamic | Public / Guest | Student login with Email/Password & Google OAuth |
| /signup | Dynamic | Public / Guest | Student registration with email verification |
| /auth/callback | Route Handler | System | OAuth code exchange & email verification handler |
| /careers (or /#careers) | Static | Public | Full Catalog of 52 Careers |
| /careers/[slug] | Dynamic (SSR) | Public | Career overview with list of learning paths |
| /careers/[slug]/[pathSlug] | Dynamic (SSR) | Public / Auth | Path detail, skills breakdown, progress strip, certificate CTA |
| /careers/[slug]/[pathSlug]/[skillSlug] | Dynamic (SSR) | Public (Track 1) / Auth (Tracks 2+) | Interactive skill booklet, track steps, quiz unlock |
| /careers/[slug]/[pathSlug]/[skillSlug]/quiz | Dynamic (SSR) | Authenticated | 15-question competency quiz evaluation |
| /certificates | Dynamic (SSR) | Authenticated | Learner dashboard of earned certificates & in-progress paths |
| /certificates/[certId] | Dynamic (SSR) | Authenticated (Owner) | Certificate credential view, printable preview, PDF download |
| /verify | Static / Client | Public | Public certificate verification search |
| /verify/[certificate_id] | Dynamic (SSR) | Public | Tamper-proof HMAC certificate verification page |
| /settings | Dynamic (SSR) | Authenticated | User profile management, password update, account deletion |
| /admin | Dynamic (SSR) | Admin / Super Admin | Admin dashboard overview & user metrics |
| /admin/careers | Dynamic (SSR) | Admin | Career management & editing |
| /admin/paths | Dynamic (SSR) | Admin | Learning path hierarchy management |
| /admin/skills | Dynamic (SSR) | Admin | Skill configuration & hours management |
| /admin/modules | Dynamic (SSR) | Admin | Track & Step content management |
| /admin/certificates | Dynamic (SSR) | Admin | Path certificate template configuration & signatory setup |
| /api/me | API Route | Authenticated | Lightweight user profile & role verification endpoint |

## 📚 2. Full Career Learning Paths & End Learnings Directory

### 1. Agriculture & Agribusiness
- **Career Route**: /careers/agriculture-agribusiness
- **Description**: Grow, manage, and market agricultural products.

#### 🛤️ Path 1: Modern Farm Management
- **Path Route**: /careers/agriculture-agribusiness/modern-farm-management
- **Path Scope**: Run an efficient, productive farming operation.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Soil & Crop Management](/careers/agriculture-agribusiness/modern-farm-management/soil-and-crop-management)**<br>/careers/agriculture-agribusiness/modern-farm-management/soil-and-crop-management | Understanding soil health and crop cycles.<br>*Key Tracks: Module 1: Soil & Crop Management, Module 3: Soil & Crop Management, Module 2: Soil & Crop Management* | 3 Tracks |
| 2 | **[Irrigation & Water Management](/careers/agriculture-agribusiness/modern-farm-management/irrigation-and-water-management)**<br>/careers/agriculture-agribusiness/modern-farm-management/irrigation-and-water-management | Efficient water use for crop production.<br>*Key Tracks: Module 1: Irrigation & Water Management, Module 2: Irrigation & Water Management, Module 3: Irrigation & Water Management* | 3 Tracks |
| 3 | **[Farm Equipment Operation Basics](/careers/agriculture-agribusiness/modern-farm-management/farm-equipment-operation-basics)**<br>/careers/agriculture-agribusiness/modern-farm-management/farm-equipment-operation-basics | Safe, effective use of common farm machinery.<br>*Key Tracks: Module 3: Farm Equipment Operation Basics, Module 2: Farm Equipment Operation Basics, Module 1: Farm Equipment Operation Basics* | 3 Tracks |
| 4 | **[Agribusiness & Market Sales](/careers/agriculture-agribusiness/modern-farm-management/agribusiness-and-market-sales)**<br>/careers/agriculture-agribusiness/modern-farm-management/agribusiness-and-market-sales | Pricing and selling agricultural products profitably.<br>*Key Tracks: Module 1: Agribusiness & Market Sales, Module 3: Agribusiness & Market Sales, Module 2: Agribusiness & Market Sales* | 3 Tracks |

---

### 2. Architecture & Construction
- **Career Route**: /careers/architecture-construction
- **Description**: Design and build the structures people live and work in.

#### 🛤️ Path 1: Architectural Design Foundations
- **Path Route**: /careers/architecture-construction/architectural-design-foundations
- **Path Scope**: Core skills for designing buildings and spaces.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Architectural Drafting](/careers/architecture-construction/architectural-design-foundations/architectural-drafting)**<br>/careers/architecture-construction/architectural-design-foundations/architectural-drafting | Producing accurate plans, elevations, and sections.<br>*Key Tracks: Module 3: Architectural Drafting, Module 2: Architectural Drafting, Module 1: Architectural Drafting* | 3 Tracks |
| 2 | **[CAD for Architecture](/careers/architecture-construction/architectural-design-foundations/cad-for-architecture)**<br>/careers/architecture-construction/architectural-design-foundations/cad-for-architecture | Drawing and modeling in AutoCAD or similar tools.<br>*Key Tracks: Module 1: CAD for Architecture, Module 4: CAD for Architecture, Module 2: CAD for Architecture* | 4 Tracks |
| 3 | **[Building Codes & Zoning Basics](/careers/architecture-construction/architectural-design-foundations/building-codes-and-zoning-basics)**<br>/careers/architecture-construction/architectural-design-foundations/building-codes-and-zoning-basics | Designing within legal and safety requirements.<br>*Key Tracks: Module 1: Building Codes & Zoning Basics, Module 3: Building Codes & Zoning Basics, Module 2: Building Codes & Zoning Basics* | 3 Tracks |
| 4 | **[Materials & Construction Methods](/careers/architecture-construction/architectural-design-foundations/materials-and-construction-methods)**<br>/careers/architecture-construction/architectural-design-foundations/materials-and-construction-methods | How buildings are actually assembled.<br>*Key Tracks: Module 1: Materials & Construction Methods, Module 3: Materials & Construction Methods, Module 2: Materials & Construction Methods* | 3 Tracks |
| 5 | **[3D Modeling & Visualization](/careers/architecture-construction/architectural-design-foundations/3d-modeling-and-visualization)**<br>/careers/architecture-construction/architectural-design-foundations/3d-modeling-and-visualization | Presenting designs with renders and walkthroughs.<br>*Key Tracks: Module 2: 3D Modeling & Visualization, Module 1: 3D Modeling & Visualization* | 2 Tracks |

#### 🛤️ Path 2: Construction Project Management
- **Path Route**: /careers/architecture-construction/construction-project-management
- **Path Scope**: Plan and oversee construction projects from start to finish.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Construction Planning & Scheduling](/careers/architecture-construction/construction-project-management/construction-planning-and-scheduling)**<br>/careers/architecture-construction/construction-project-management/construction-planning-and-scheduling | Sequencing work and tracking timelines.<br>*Key Tracks: Module 3: Construction Planning & Scheduling, Module 2: Construction Planning & Scheduling, Module 1: Construction Planning & Scheduling* | 3 Tracks |
| 2 | **[Cost Estimation](/careers/architecture-construction/construction-project-management/cost-estimation)**<br>/careers/architecture-construction/construction-project-management/cost-estimation | Budgeting materials, labor, and contingencies.<br>*Key Tracks: Module 3: Cost Estimation, Module 2: Cost Estimation, Module 1: Cost Estimation* | 3 Tracks |
| 3 | **[Site Safety Management](/careers/architecture-construction/construction-project-management/site-safety-management)**<br>/careers/architecture-construction/construction-project-management/site-safety-management | Keeping job sites compliant and accident-free.<br>*Key Tracks: Module 2: Site Safety Management, Module 3: Site Safety Management, Module 1: Site Safety Management* | 3 Tracks |
| 4 | **[Contractor & Vendor Coordination](/careers/architecture-construction/construction-project-management/contractor-and-vendor-coordination)**<br>/careers/architecture-construction/construction-project-management/contractor-and-vendor-coordination | Managing subcontractors, suppliers, and inspections.<br>*Key Tracks: Module 1: Contractor & Vendor Coordination, Module 2: Contractor & Vendor Coordination, Module 3: Contractor & Vendor Coordination* | 3 Tracks |

---

### 3. Automotive Technology
- **Career Route**: /careers/automotive-technology
- **Description**: Diagnose, repair, and maintain vehicles.

#### 🛤️ Path 1: Automotive Repair Foundations
- **Path Route**: /careers/automotive-technology/automotive-repair-foundations
- **Path Scope**: Core skills for diagnosing and repairing modern vehicles.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Automotive Safety & Tools](/careers/automotive-technology/automotive-repair-foundations/automotive-safety-and-tools)**<br>/careers/automotive-technology/automotive-repair-foundations/automotive-safety-and-tools | Safe use of tools and shop equipment.<br>*Key Tracks: Module 3: Automotive Safety & Tools, Module 1: Automotive Safety & Tools, Module 2: Automotive Safety & Tools* | 3 Tracks |
| 2 | **[Engine Systems Fundamentals](/careers/automotive-technology/automotive-repair-foundations/engine-systems-fundamentals)**<br>/careers/automotive-technology/automotive-repair-foundations/engine-systems-fundamentals | How combustion engines work and fail.<br>*Key Tracks: Module 2: Engine Systems Fundamentals, Module 1: Engine Systems Fundamentals, Module 4: Engine Systems Fundamentals* | 4 Tracks |
| 3 | **[Electrical Systems Diagnostics](/careers/automotive-technology/automotive-repair-foundations/electrical-systems-diagnostics)**<br>/careers/automotive-technology/automotive-repair-foundations/electrical-systems-diagnostics | Diagnosing vehicle electrical and sensor issues.<br>*Key Tracks: Module 3: Electrical Systems Diagnostics, Module 2: Electrical Systems Diagnostics, Module 1: Electrical Systems Diagnostics* | 3 Tracks |
| 4 | **[Brakes & Suspension Repair](/careers/automotive-technology/automotive-repair-foundations/brakes-and-suspension-repair)**<br>/careers/automotive-technology/automotive-repair-foundations/brakes-and-suspension-repair | Common repair procedures for brakes and suspension.<br>*Key Tracks: Module 3: Brakes & Suspension Repair, Module 2: Brakes & Suspension Repair, Module 1: Brakes & Suspension Repair* | 3 Tracks |
| 5 | **[Diagnostic Scan Tools](/careers/automotive-technology/automotive-repair-foundations/diagnostic-scan-tools)**<br>/careers/automotive-technology/automotive-repair-foundations/diagnostic-scan-tools | Using OBD scanners to identify faults.<br>*Key Tracks: Module 1: Diagnostic Scan Tools, Module 2: Diagnostic Scan Tools* | 2 Tracks |

---

### 4. Aviation
- **Career Route**: /careers/aviation
- **Description**: Skills for careers in and around flight operations.

#### 🛤️ Path 1: Aviation Ground Operations
- **Path Route**: /careers/aviation/aviation-ground-operations
- **Path Scope**: Support safe and efficient airport and flight operations.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Aviation Safety Fundamentals](/careers/aviation/aviation-ground-operations/aviation-safety-fundamentals)**<br>/careers/aviation/aviation-ground-operations/aviation-safety-fundamentals | Core safety standards in aviation environments.<br>*Key Tracks: Module 2: Aviation Safety Fundamentals, Module 3: Aviation Safety Fundamentals, Module 1: Aviation Safety Fundamentals* | 3 Tracks |
| 2 | **[Airport Ground Operations](/careers/aviation/aviation-ground-operations/airport-ground-operations)**<br>/careers/aviation/aviation-ground-operations/airport-ground-operations | Ramp, baggage, and turnaround processes.<br>*Key Tracks: Module 3: Airport Ground Operations, Module 2: Airport Ground Operations, Module 1: Airport Ground Operations* | 3 Tracks |
| 3 | **[Aviation Regulations Basics](/careers/aviation/aviation-ground-operations/aviation-regulations-basics)**<br>/careers/aviation/aviation-ground-operations/aviation-regulations-basics | Understanding key regulatory requirements.<br>*Key Tracks: Module 3: Aviation Regulations Basics, Module 2: Aviation Regulations Basics, Module 1: Aviation Regulations Basics* | 3 Tracks |
| 4 | **[Flight Scheduling & Coordination](/careers/aviation/aviation-ground-operations/flight-scheduling-and-coordination)**<br>/careers/aviation/aviation-ground-operations/flight-scheduling-and-coordination | Coordinating schedules across ground and flight crews.<br>*Key Tracks: Module 1: Flight Scheduling & Coordination, Module 2: Flight Scheduling & Coordination, Module 3: Flight Scheduling & Coordination* | 3 Tracks |

---

### 5. Cloud & DevOps Infrastructure
- **Career Route**: /careers/cloud-devops-infrastructure
- **Description**: Design and operate the cloud infrastructure that modern software runs on.

#### 🛤️ Path 1: Cloud Architecture
- **Path Route**: /careers/cloud-devops-infrastructure/cloud-architecture
- **Path Scope**: Design scalable, resilient systems on cloud platforms.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Cloud Computing Fundamentals](/careers/cloud-devops-infrastructure/cloud-architecture/cloud-computing-fundamentals)**<br>/careers/cloud-devops-infrastructure/cloud-architecture/cloud-computing-fundamentals | Compute, storage, networking across AWS/Azure/GCP.<br>*Key Tracks: Module 2: Cloud Computing Fundamentals, Module 3: Cloud Computing Fundamentals, Module 1: Cloud Computing Fundamentals* | 3 Tracks |
| 2 | **[Infrastructure as Code](/careers/cloud-devops-infrastructure/cloud-architecture/infrastructure-as-code)**<br>/careers/cloud-devops-infrastructure/cloud-architecture/infrastructure-as-code | Terraform for repeatable infrastructure provisioning.<br>*Key Tracks: Module 2: Infrastructure as Code, Module 4: Infrastructure as Code, Module 3: Infrastructure as Code* | 4 Tracks |
| 3 | **[Cloud Security](/careers/cloud-devops-infrastructure/cloud-architecture/cloud-security)**<br>/careers/cloud-devops-infrastructure/cloud-architecture/cloud-security | IAM, network security groups, and encryption in the cloud.<br>*Key Tracks: Module 2: Cloud Security, Module 3: Cloud Security, Module 1: Cloud Security* | 3 Tracks |
| 4 | **[Scalability & High Availability](/careers/cloud-devops-infrastructure/cloud-architecture/scalability-and-high-availability)**<br>/careers/cloud-devops-infrastructure/cloud-architecture/scalability-and-high-availability | Load balancing, auto-scaling, and failover design.<br>*Key Tracks: Module 1: Scalability & High Availability, Module 4: Scalability & High Availability, Module 3: Scalability & High Availability* | 4 Tracks |
| 5 | **[Cost Optimization](/careers/cloud-devops-infrastructure/cloud-architecture/cost-optimization)**<br>/careers/cloud-devops-infrastructure/cloud-architecture/cost-optimization | Right-sizing resources and managing cloud spend.<br>*Key Tracks: Module 1: Cost Optimization, Module 2: Cost Optimization* | 2 Tracks |
| 6 | **[Cloud Certification Prep](/careers/cloud-devops-infrastructure/cloud-architecture/cloud-certification-prep)**<br>/careers/cloud-devops-infrastructure/cloud-architecture/cloud-certification-prep | Structured review for a major cloud certification exam.<br>*Key Tracks: Module 2: Cloud Certification Prep, Module 1: Cloud Certification Prep* | 2 Tracks |

#### 🛤️ Path 2: Site Reliability Engineering
- **Path Route**: /careers/cloud-devops-infrastructure/site-reliability-engineering
- **Path Scope**: Keep large-scale systems fast, available, and observable.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Systems & Networking](/careers/cloud-devops-infrastructure/site-reliability-engineering/systems-and-networking)**<br>/careers/cloud-devops-infrastructure/site-reliability-engineering/systems-and-networking | Deeper OS and network internals for reliability work.<br>*Key Tracks: Module 2: Systems & Networking, Module 3: Systems & Networking, Module 1: Systems & Networking* | 3 Tracks |
| 2 | **[Observability](/careers/cloud-devops-infrastructure/site-reliability-engineering/observability)**<br>/careers/cloud-devops-infrastructure/site-reliability-engineering/observability | Metrics, logs, and traces for understanding system health.<br>*Key Tracks: Module 3: Observability, Module 2: Observability, Module 1: Observability* | 3 Tracks |
| 3 | **[Incident Management](/careers/cloud-devops-infrastructure/site-reliability-engineering/incident-management)**<br>/careers/cloud-devops-infrastructure/site-reliability-engineering/incident-management | On-call practices, postmortems, and blameless review.<br>*Key Tracks: Module 1: Incident Management, Module 2: Incident Management, Module 3: Incident Management* | 3 Tracks |
| 4 | **[Automation & Scripting](/careers/cloud-devops-infrastructure/site-reliability-engineering/automation-and-scripting)**<br>/careers/cloud-devops-infrastructure/site-reliability-engineering/automation-and-scripting | Reducing toil through automation.<br>*Key Tracks: Module 2: Automation & Scripting, Module 3: Automation & Scripting, Module 1: Automation & Scripting* | 3 Tracks |
| 5 | **[Capacity Planning](/careers/cloud-devops-infrastructure/site-reliability-engineering/capacity-planning)**<br>/careers/cloud-devops-infrastructure/site-reliability-engineering/capacity-planning | Forecasting load and planning infrastructure ahead of demand.<br>*Key Tracks: Module 3: Capacity Planning, Module 2: Capacity Planning, Module 1: Capacity Planning* | 3 Tracks |

---

### 6. Culinary Arts & Hospitality
- **Career Route**: /careers/culinary-arts-hospitality
- **Description**: Skills for food, beverage, and guest-facing hospitality careers.

#### 🛤️ Path 1: Professional Cooking Foundations
- **Path Route**: /careers/culinary-arts-hospitality/professional-cooking-foundations
- **Path Scope**: Core kitchen skills used in professional cooking.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Kitchen Safety & Sanitation](/careers/culinary-arts-hospitality/professional-cooking-foundations/kitchen-safety-and-sanitation)**<br>/careers/culinary-arts-hospitality/professional-cooking-foundations/kitchen-safety-and-sanitation | Food safety standards and safe kitchen practices.<br>*Key Tracks: Module 2: Kitchen Safety & Sanitation, Module 3: Kitchen Safety & Sanitation, Module 1: Kitchen Safety & Sanitation* | 3 Tracks |
| 2 | **[Knife Skills](/careers/culinary-arts-hospitality/professional-cooking-foundations/knife-skills)**<br>/careers/culinary-arts-hospitality/professional-cooking-foundations/knife-skills | Precise, efficient, and safe cutting techniques.<br>*Key Tracks: Module 1: Knife Skills, Module 3: Knife Skills, Module 2: Knife Skills* | 3 Tracks |
| 3 | **[Cooking Techniques](/careers/culinary-arts-hospitality/professional-cooking-foundations/cooking-techniques)**<br>/careers/culinary-arts-hospitality/professional-cooking-foundations/cooking-techniques | Sauteing, braising, roasting, and other core methods.<br>*Key Tracks: Module 3: Cooking Techniques, Module 4: Cooking Techniques, Module 2: Cooking Techniques* | 4 Tracks |
| 4 | **[Menu & Recipe Costing](/careers/culinary-arts-hospitality/professional-cooking-foundations/menu-and-recipe-costing)**<br>/careers/culinary-arts-hospitality/professional-cooking-foundations/menu-and-recipe-costing | Pricing dishes profitably.<br>*Key Tracks: Module 2: Menu & Recipe Costing, Module 1: Menu & Recipe Costing* | 2 Tracks |
| 5 | **[Plating & Presentation](/careers/culinary-arts-hospitality/professional-cooking-foundations/plating-and-presentation)**<br>/careers/culinary-arts-hospitality/professional-cooking-foundations/plating-and-presentation | Making food look as good as it tastes.<br>*Key Tracks: Module 1: Plating & Presentation, Module 2: Plating & Presentation* | 2 Tracks |

#### 🛤️ Path 2: Hospitality & Guest Service
- **Path Route**: /careers/culinary-arts-hospitality/hospitality-guest-service
- **Path Scope**: Deliver excellent guest experiences in hotels, restaurants, and events.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Customer Service Excellence](/careers/culinary-arts-hospitality/hospitality-guest-service/customer-service-excellence)**<br>/careers/culinary-arts-hospitality/hospitality-guest-service/customer-service-excellence | Creating positive guest experiences consistently.<br>*Key Tracks: Module 2: Customer Service Excellence, Module 1: Customer Service Excellence, Module 3: Customer Service Excellence* | 3 Tracks |
| 2 | **[Reservations & Front Desk Operations](/careers/culinary-arts-hospitality/hospitality-guest-service/reservations-and-front-desk-operations)**<br>/careers/culinary-arts-hospitality/hospitality-guest-service/reservations-and-front-desk-operations | Managing bookings and guest check-in/out.<br>*Key Tracks: Module 2: Reservations & Front Desk Operations, Module 1: Reservations & Front Desk Operations, Module 3: Reservations & Front Desk Operations* | 3 Tracks |
| 3 | **[Handling Complaints Gracefully](/careers/culinary-arts-hospitality/hospitality-guest-service/handling-complaints-gracefully)**<br>/careers/culinary-arts-hospitality/hospitality-guest-service/handling-complaints-gracefully | Turning service issues into positive outcomes.<br>*Key Tracks: Module 2: Handling Complaints Gracefully, Module 1: Handling Complaints Gracefully* | 2 Tracks |
| 4 | **[Event & Service Coordination](/careers/culinary-arts-hospitality/hospitality-guest-service/event-and-service-coordination)**<br>/careers/culinary-arts-hospitality/hospitality-guest-service/event-and-service-coordination | Coordinating logistics for guest events.<br>*Key Tracks: Module 3: Event & Service Coordination, Module 1: Event & Service Coordination, Module 2: Event & Service Coordination* | 3 Tracks |

---

### 7. Cybersecurity
- **Career Route**: /careers/cybersecurity
- **Description**: Protect systems, networks, and data from attackers.

#### 🛤️ Path 1: Security Analyst
- **Path Route**: /careers/cybersecurity/security-analyst
- **Path Scope**: Monitor, detect, and respond to security threats.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Networking Fundamentals](/careers/cybersecurity/security-analyst/networking-fundamentals)**<br>/careers/cybersecurity/security-analyst/networking-fundamentals | TCP/IP, DNS, firewalls, and network topology.<br>*Key Tracks: Module 2: Networking Fundamentals, Module 1: Networking Fundamentals, Module 3: Networking Fundamentals* | 3 Tracks |
| 2 | **[Security Fundamentals](/careers/cybersecurity/security-analyst/security-fundamentals)**<br>/careers/cybersecurity/security-analyst/security-fundamentals | CIA triad, threat models, common attack types.<br>*Key Tracks: Module 1: Security Fundamentals, Module 3: Security Fundamentals, Module 2: Security Fundamentals* | 3 Tracks |
| 3 | **[SIEM & Log Analysis](/careers/cybersecurity/security-analyst/siem-and-log-analysis)**<br>/careers/cybersecurity/security-analyst/siem-and-log-analysis | Detecting anomalies using security monitoring tools.<br>*Key Tracks: Module 1: SIEM & Log Analysis, Module 2: SIEM & Log Analysis, Module 3: SIEM & Log Analysis* | 3 Tracks |
| 4 | **[Incident Response](/careers/cybersecurity/security-analyst/incident-response)**<br>/careers/cybersecurity/security-analyst/incident-response | Containing, investigating, and recovering from incidents.<br>*Key Tracks: Module 3: Incident Response, Module 1: Incident Response, Module 2: Incident Response* | 3 Tracks |
| 5 | **[Security Compliance Basics](/careers/cybersecurity/security-analyst/security-compliance-basics)**<br>/careers/cybersecurity/security-analyst/security-compliance-basics | Frameworks like ISO 27001, SOC 2, and audit readiness.<br>*Key Tracks: Module 3: Security Compliance Basics, Module 2: Security Compliance Basics, Module 1: Security Compliance Basics* | 3 Tracks |

#### 🛤️ Path 2: Ethical Hacking & Pentesting
- **Path Route**: /careers/cybersecurity/ethical-hacking-pentesting
- **Path Scope**: Find and responsibly report vulnerabilities before attackers do.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Linux for Security](/careers/cybersecurity/ethical-hacking-pentesting/linux-for-security)**<br>/careers/cybersecurity/ethical-hacking-pentesting/linux-for-security | Command line fluency for security tooling.<br>*Key Tracks: Module 2: Linux for Security, Module 1: Linux for Security, Module 3: Linux for Security* | 3 Tracks |
| 2 | **[Web Application Security](/careers/cybersecurity/ethical-hacking-pentesting/web-application-security)**<br>/careers/cybersecurity/ethical-hacking-pentesting/web-application-security | OWASP Top 10 and common web vulnerabilities.<br>*Key Tracks: Module 3: Web Application Security, Module 1: Web Application Security, Module 4: Web Application Security* | 4 Tracks |
| 3 | **[Network Penetration Testing](/careers/cybersecurity/ethical-hacking-pentesting/network-penetration-testing)**<br>/careers/cybersecurity/ethical-hacking-pentesting/network-penetration-testing | Scanning, enumeration, and exploitation basics.<br>*Key Tracks: Module 4: Network Penetration Testing, Module 3: Network Penetration Testing, Module 2: Network Penetration Testing* | 4 Tracks |
| 4 | **[Vulnerability Assessment Tools](/careers/cybersecurity/ethical-hacking-pentesting/vulnerability-assessment-tools)**<br>/careers/cybersecurity/ethical-hacking-pentesting/vulnerability-assessment-tools | Using scanners and interpreting results.<br>*Key Tracks: Module 3: Vulnerability Assessment Tools, Module 2: Vulnerability Assessment Tools, Module 1: Vulnerability Assessment Tools* | 3 Tracks |
| 5 | **[Reporting & Responsible Disclosure](/careers/cybersecurity/ethical-hacking-pentesting/reporting-and-responsible-disclosure)**<br>/careers/cybersecurity/ethical-hacking-pentesting/reporting-and-responsible-disclosure | Communicating findings clearly and ethically.<br>*Key Tracks: Module 1: Reporting & Responsible Disclosure, Module 2: Reporting & Responsible Disclosure, Module 3: Reporting & Responsible Disclosure* | 3 Tracks |

---

### 8. Data Science & AI
- **Career Route**: /careers/data-science-ai
- **Description**: Extract insight from data and build systems that learn from it.

#### 🛤️ Path 1: Data Analyst
- **Path Route**: /careers/data-science-ai/data-analyst
- **Path Scope**: Master SQL, Python, Pandas, and data visualization to drive business insights.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[SQL & Relational Databases](/careers/data-science-ai/data-analyst/sql-relational-databases)**<br>/careers/data-science-ai/data-analyst/sql-relational-databases | Query databases using SELECT, JOIN, GROUP BY, and aggregations.<br>*Key Tracks: Module 1: Querying Data with SQL* | 1 Tracks |

#### 🛤️ Path 2: Data Analytics
- **Path Route**: /careers/data-science-ai/data-analytics
- **Path Scope**: Turn raw data into decisions using statistics and visualization.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Excel for Analysis](/careers/data-science-ai/data-analytics/excel-for-analysis)**<br>/careers/data-science-ai/data-analytics/excel-for-analysis | Pivot tables, formulas, and data cleaning in spreadsheets.<br>*Key Tracks: Module 1: Excel for Analysis, Module 3: Excel for Analysis, Module 2: Excel for Analysis* | 3 Tracks |
| 2 | **[SQL for Analysts](/careers/data-science-ai/data-analytics/sql-for-analysts)**<br>/careers/data-science-ai/data-analytics/sql-for-analysts | Querying, joining, and aggregating relational data.<br>*Key Tracks: Module 3: SQL for Analysts, Module 1: SQL for Analysts, Module 2: SQL for Analysts* | 3 Tracks |
| 3 | **[Statistics Fundamentals](/careers/data-science-ai/data-analytics/statistics-fundamentals)**<br>/careers/data-science-ai/data-analytics/statistics-fundamentals | Descriptive stats, distributions, hypothesis testing.<br>*Key Tracks: Module 2: Statistics Fundamentals, Module 3: Statistics Fundamentals, Module 1: Statistics Fundamentals* | 3 Tracks |
| 4 | **[Data Visualization](/careers/data-science-ai/data-analytics/data-visualization)**<br>/careers/data-science-ai/data-analytics/data-visualization | Building dashboards with Tableau or Power BI.<br>*Key Tracks: Module 2: Data Visualization, Module 3: Data Visualization, Module 1: Data Visualization* | 3 Tracks |
| 5 | **[Python for Data Analysis](/careers/data-science-ai/data-analytics/python-for-data-analysis)**<br>/careers/data-science-ai/data-analytics/python-for-data-analysis | Pandas, NumPy, and exploratory data analysis.<br>*Key Tracks: Module 2: Python for Data Analysis, Module 1: Python for Data Analysis, Module 3: Python for Data Analysis* | 3 Tracks |

#### 🛤️ Path 3: Machine Learning Engineering
- **Path Route**: /careers/data-science-ai/machine-learning-engineering
- **Path Scope**: Build, train, and deploy models that make predictions.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Python Programming](/careers/data-science-ai/machine-learning-engineering/python-programming)**<br>/careers/data-science-ai/machine-learning-engineering/python-programming | Core language skills for data and ML work.<br>*Key Tracks: Module 2: Python Programming, Module 4: Python Programming, Module 3: Python Programming* | 4 Tracks |
| 2 | **[Linear Algebra & Calculus for ML](/careers/data-science-ai/machine-learning-engineering/linear-algebra-and-calculus-for-ml)**<br>/careers/data-science-ai/machine-learning-engineering/linear-algebra-and-calculus-for-ml | Mathematical foundations behind ML algorithms.<br>*Key Tracks: Module 3: Linear Algebra & Calculus for ML, Module 1: Linear Algebra & Calculus for ML, Module 2: Linear Algebra & Calculus for ML* | 3 Tracks |
| 3 | **[Supervised & Unsupervised Learning](/careers/data-science-ai/machine-learning-engineering/supervised-and-unsupervised-learning)**<br>/careers/data-science-ai/machine-learning-engineering/supervised-and-unsupervised-learning | Classification, regression, clustering with scikit-learn.<br>*Key Tracks: Module 2: Supervised & Unsupervised Learning, Module 4: Supervised & Unsupervised Learning, Module 3: Supervised & Unsupervised Learning* | 4 Tracks |
| 4 | **[Deep Learning Fundamentals](/careers/data-science-ai/machine-learning-engineering/deep-learning-fundamentals)**<br>/careers/data-science-ai/machine-learning-engineering/deep-learning-fundamentals | Neural networks, backpropagation, PyTorch/TensorFlow basics.<br>*Key Tracks: Module 3: Deep Learning Fundamentals, Module 4: Deep Learning Fundamentals, Module 2: Deep Learning Fundamentals* | 4 Tracks |
| 5 | **[Model Evaluation & Tuning](/careers/data-science-ai/machine-learning-engineering/model-evaluation-and-tuning)**<br>/careers/data-science-ai/machine-learning-engineering/model-evaluation-and-tuning | Cross-validation, metrics, hyperparameter search.<br>*Key Tracks: Module 2: Model Evaluation & Tuning, Module 3: Model Evaluation & Tuning, Module 1: Model Evaluation & Tuning* | 3 Tracks |
| 6 | **[ML Deployment](/careers/data-science-ai/machine-learning-engineering/ml-deployment)**<br>/careers/data-science-ai/machine-learning-engineering/ml-deployment | Serving models via APIs and monitoring in production.<br>*Key Tracks: Module 2: ML Deployment, Module 1: ML Deployment* | 2 Tracks |

#### 🛤️ Path 4: Data Engineering
- **Path Route**: /careers/data-science-ai/data-engineering
- **Path Scope**: Build the pipelines that move and prepare data at scale.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[SQL & Data Warehousing](/careers/data-science-ai/data-engineering/sql-and-data-warehousing)**<br>/careers/data-science-ai/data-engineering/sql-and-data-warehousing | Star schemas, warehouses, and query optimization.<br>*Key Tracks: Module 2: SQL & Data Warehousing, Module 3: SQL & Data Warehousing, Module 1: SQL & Data Warehousing* | 4 Tracks |
| 2 | **[ETL/ELT Pipelines](/careers/data-science-ai/data-engineering/etl-and-elt-pipelines)**<br>/careers/data-science-ai/data-engineering/etl-and-elt-pipelines | Extracting, transforming, and loading data reliably.<br>*Key Tracks: Module 3: ETL/ELT Pipelines, Module 4: ETL/ELT Pipelines, Module 2: ETL/ELT Pipelines* | 4 Tracks |
| 3 | **[Python for Data Engineering](/careers/data-science-ai/data-engineering/python-for-data-engineering)**<br>/careers/data-science-ai/data-engineering/python-for-data-engineering | Scripting pipelines and working with APIs/files.<br>*Key Tracks: Module 3: Python for Data Engineering, Module 2: Python for Data Engineering, Module 1: Python for Data Engineering* | 3 Tracks |
| 4 | **[Big Data Tools](/careers/data-science-ai/data-engineering/big-data-tools)**<br>/careers/data-science-ai/data-engineering/big-data-tools | Spark and distributed processing basics.<br>*Key Tracks: Module 2: Big Data Tools, Module 3: Big Data Tools, Module 1: Big Data Tools* | 3 Tracks |
| 5 | **[Data Pipeline Orchestration](/careers/data-science-ai/data-engineering/data-pipeline-orchestration)**<br>/careers/data-science-ai/data-engineering/data-pipeline-orchestration | Scheduling and monitoring with Airflow.<br>*Key Tracks: Module 2: Data Pipeline Orchestration, Module 3: Data Pipeline Orchestration, Module 1: Data Pipeline Orchestration* | 3 Tracks |

---

### 9. Digital Marketing
- **Career Route**: /careers/digital-marketing
- **Description**: Plan, run, and measure campaigns that reach audiences and grow businesses online.

#### 🛤️ Path 1: Performance Marketing
- **Path Route**: /careers/digital-marketing/performance-marketing
- **Path Scope**: Run and optimize paid campaigns across major ad platforms.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Meta Ads Management](/careers/digital-marketing/performance-marketing/meta-ads-management)**<br>/careers/digital-marketing/performance-marketing/meta-ads-management | Campaign structure, targeting, and optimization on Facebook & Instagram.<br>*Key Tracks: Module 2: Meta Ads Management, Module 1: Meta Ads Management, Module 3: Meta Ads Management* | 4 Tracks |
| 2 | **[Google Ads Management](/careers/digital-marketing/performance-marketing/google-ads-management)**<br>/careers/digital-marketing/performance-marketing/google-ads-management | Search, display, and shopping campaigns on Google Ads.<br>*Key Tracks: Module 3: Google Ads Management, Module 4: Google Ads Management, Module 2: Google Ads Management* | 4 Tracks |
| 3 | **[Ad Budgeting & Bidding Strategy](/careers/digital-marketing/performance-marketing/ad-budgeting-and-bidding-strategy)**<br>/careers/digital-marketing/performance-marketing/ad-budgeting-and-bidding-strategy | Allocating spend and choosing bid strategies for ROI.<br>*Key Tracks: Module 3: Ad Budgeting & Bidding Strategy, Module 2: Ad Budgeting & Bidding Strategy, Module 1: Ad Budgeting & Bidding Strategy* | 3 Tracks |
| 4 | **[Landing Page Optimization](/careers/digital-marketing/performance-marketing/landing-page-optimization)**<br>/careers/digital-marketing/performance-marketing/landing-page-optimization | Designing pages that convert paid traffic.<br>*Key Tracks: Module 2: Landing Page Optimization, Module 1: Landing Page Optimization* | 2 Tracks |
| 5 | **[A/B Testing for Ads](/careers/digital-marketing/performance-marketing/a-and-b-testing-for-ads)**<br>/careers/digital-marketing/performance-marketing/a-and-b-testing-for-ads | Structuring experiments and reading results correctly.<br>*Key Tracks: Module 2: A/B Testing for Ads, Module 1: A/B Testing for Ads* | 2 Tracks |

#### 🛤️ Path 2: Content & Brand
- **Path Route**: /careers/digital-marketing/content-and-brand
- **Path Scope**: Create the writing, stories, and creative that build an audience.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Content Writing](/careers/digital-marketing/content-and-brand/content-writing)**<br>/careers/digital-marketing/content-and-brand/content-writing | Blog posts, web copy, and long-form content that reads well and ranks.<br>*Key Tracks: Module 3: Content Writing, Module 1: Content Writing, Module 2: Content Writing* | 3 Tracks |
| 2 | **[Script Writing & Storytelling](/careers/digital-marketing/content-and-brand/script-writing-and-storytelling)**<br>/careers/digital-marketing/content-and-brand/script-writing-and-storytelling | Structuring narratives for video, reels, and ads.<br>*Key Tracks: Module 2: Script Writing & Storytelling, Module 3: Script Writing & Storytelling, Module 1: Script Writing & Storytelling* | 3 Tracks |
| 3 | **[SEO Fundamentals](/careers/digital-marketing/content-and-brand/seo-fundamentals)**<br>/careers/digital-marketing/content-and-brand/seo-fundamentals | Keyword research, on-page SEO, and content structure for search.<br>*Key Tracks: Module 1: SEO Fundamentals, Module 3: SEO Fundamentals, Module 2: SEO Fundamentals* | 3 Tracks |
| 4 | **[Social Media Strategy](/careers/digital-marketing/content-and-brand/social-media-strategy)**<br>/careers/digital-marketing/content-and-brand/social-media-strategy | Platform-specific content planning and calendars.<br>*Key Tracks: Module 1: Social Media Strategy, Module 2: Social Media Strategy* | 2 Tracks |
| 5 | **[Brand Voice & Positioning](/careers/digital-marketing/content-and-brand/brand-voice-and-positioning)**<br>/careers/digital-marketing/content-and-brand/brand-voice-and-positioning | Defining and maintaining a consistent brand identity in content.<br>*Key Tracks: Module 1: Brand Voice & Positioning, Module 2: Brand Voice & Positioning* | 2 Tracks |

#### 🛤️ Path 3: Marketing Analytics
- **Path Route**: /careers/digital-marketing/marketing-analytics
- **Path Scope**: Measure what's working and turn data into marketing decisions.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Google Analytics & Tag Manager](/careers/digital-marketing/marketing-analytics/google-analytics-and-tag-manager)**<br>/careers/digital-marketing/marketing-analytics/google-analytics-and-tag-manager | Tracking setup, events, and funnels.<br>*Key Tracks: Module 2: Google Analytics & Tag Manager, Module 3: Google Analytics & Tag Manager, Module 1: Google Analytics & Tag Manager* | 3 Tracks |
| 2 | **[Marketing Reporting & Dashboards](/careers/digital-marketing/marketing-analytics/marketing-reporting-and-dashboards)**<br>/careers/digital-marketing/marketing-analytics/marketing-reporting-and-dashboards | Turning campaign data into stakeholder-ready reports.<br>*Key Tracks: Module 1: Marketing Reporting & Dashboards, Module 2: Marketing Reporting & Dashboards, Module 3: Marketing Reporting & Dashboards* | 3 Tracks |
| 3 | **[Email Marketing](/careers/digital-marketing/marketing-analytics/email-marketing)**<br>/careers/digital-marketing/marketing-analytics/email-marketing | List building, automation, and email campaign performance.<br>*Key Tracks: Module 2: Email Marketing, Module 3: Email Marketing, Module 1: Email Marketing* | 3 Tracks |
| 4 | **[Competitor & Market Research](/careers/digital-marketing/marketing-analytics/competitor-and-market-research)**<br>/careers/digital-marketing/marketing-analytics/competitor-and-market-research | Benchmarking against competitors using ad libraries and SEO tools.<br>*Key Tracks: Module 2: Competitor & Market Research, Module 1: Competitor & Market Research* | 2 Tracks |

---

### 10. E-commerce Management
- **Career Route**: /careers/e-commerce-management
- **Description**: Run and grow an online store from setup to scale.

#### 🛤️ Path 1: E-commerce Operations
- **Path Route**: /careers/e-commerce-management/e-commerce-operations
- **Path Scope**: Core skills for running a profitable online store.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Online Store Setup](/careers/e-commerce-management/e-commerce-operations/online-store-setup)**<br>/careers/e-commerce-management/e-commerce-operations/online-store-setup | Configuring a storefront on platforms like Shopify.<br>*Key Tracks: Module 1: Online Store Setup, Module 2: Online Store Setup, Module 3: Online Store Setup* | 3 Tracks |
| 2 | **[Product Listings & Merchandising](/careers/e-commerce-management/e-commerce-operations/product-listings-and-merchandising)**<br>/careers/e-commerce-management/e-commerce-operations/product-listings-and-merchandising | Presenting products in ways that drive purchases.<br>*Key Tracks: Module 1: Product Listings & Merchandising, Module 2: Product Listings & Merchandising, Module 3: Product Listings & Merchandising* | 3 Tracks |
| 3 | **[E-commerce Payments & Logistics](/careers/e-commerce-management/e-commerce-operations/e-commerce-payments-and-logistics)**<br>/careers/e-commerce-management/e-commerce-operations/e-commerce-payments-and-logistics | Handling checkout, shipping, and fulfillment smoothly.<br>*Key Tracks: Module 1: E-commerce Payments & Logistics, Module 2: E-commerce Payments & Logistics, Module 3: E-commerce Payments & Logistics* | 3 Tracks |
| 4 | **[Conversion Rate Optimization](/careers/e-commerce-management/e-commerce-operations/conversion-rate-optimization)**<br>/careers/e-commerce-management/e-commerce-operations/conversion-rate-optimization | Turning more visitors into paying customers.<br>*Key Tracks: Module 1: Conversion Rate Optimization, Module 2: Conversion Rate Optimization, Module 3: Conversion Rate Optimization* | 3 Tracks |

---

### 11. Entrepreneurship & Small Business
- **Career Route**: /careers/entrepreneurship-small-business
- **Description**: Start, run, and grow a business from the ground up.

#### 🛤️ Path 1: Starting a Business
- **Path Route**: /careers/entrepreneurship-small-business/starting-a-business
- **Path Scope**: Go from idea to a validated, launched business.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Idea Validation](/careers/entrepreneurship-small-business/starting-a-business/idea-validation)**<br>/careers/entrepreneurship-small-business/starting-a-business/idea-validation | Testing demand before building.<br>*Key Tracks: Module 3: Idea Validation, Module 2: Idea Validation, Module 1: Idea Validation* | 3 Tracks |
| 2 | **[Business Model Design](/careers/entrepreneurship-small-business/starting-a-business/business-model-design)**<br>/careers/entrepreneurship-small-business/starting-a-business/business-model-design | Mapping how the business creates and captures value.<br>*Key Tracks: Module 1: Business Model Design, Module 2: Business Model Design, Module 3: Business Model Design* | 3 Tracks |
| 3 | **[Basic Business Finance](/careers/entrepreneurship-small-business/starting-a-business/basic-business-finance)**<br>/careers/entrepreneurship-small-business/starting-a-business/basic-business-finance | Pricing, margins, and cash flow for founders.<br>*Key Tracks: Module 3: Basic Business Finance, Module 2: Basic Business Finance, Module 1: Basic Business Finance* | 3 Tracks |
| 4 | **[Legal & Registration Basics](/careers/entrepreneurship-small-business/starting-a-business/legal-and-registration-basics)**<br>/careers/entrepreneurship-small-business/starting-a-business/legal-and-registration-basics | Choosing a structure and meeting basic legal requirements.<br>*Key Tracks: Module 1: Legal & Registration Basics, Module 2: Legal & Registration Basics* | 2 Tracks |
| 5 | **[Launch Planning](/careers/entrepreneurship-small-business/starting-a-business/launch-planning)**<br>/careers/entrepreneurship-small-business/starting-a-business/launch-planning | Getting the first customers and iterating fast.<br>*Key Tracks: Module 2: Launch Planning, Module 1: Launch Planning* | 2 Tracks |

#### 🛤️ Path 2: Growing & Operating a Business
- **Path Route**: /careers/entrepreneurship-small-business/growing-operating-a-business
- **Path Scope**: Manage operations and scale a running business.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Operations Management](/careers/entrepreneurship-small-business/growing-operating-a-business/operations-management)**<br>/careers/entrepreneurship-small-business/growing-operating-a-business/operations-management | Running day-to-day business processes efficiently.<br>*Key Tracks: Module 2: Operations Management, Module 3: Operations Management, Module 1: Operations Management* | 3 Tracks |
| 2 | **[Hiring Your First Team](/careers/entrepreneurship-small-business/growing-operating-a-business/hiring-your-first-team)**<br>/careers/entrepreneurship-small-business/growing-operating-a-business/hiring-your-first-team | Bringing on early employees or contractors.<br>*Key Tracks: Module 1: Hiring Your First Team, Module 2: Hiring Your First Team, Module 3: Hiring Your First Team* | 3 Tracks |
| 3 | **[Customer Retention Strategy](/careers/entrepreneurship-small-business/growing-operating-a-business/customer-retention-strategy)**<br>/careers/entrepreneurship-small-business/growing-operating-a-business/customer-retention-strategy | Keeping customers coming back.<br>*Key Tracks: Module 2: Customer Retention Strategy, Module 1: Customer Retention Strategy, Module 3: Customer Retention Strategy* | 3 Tracks |
| 4 | **[Basic Fundraising Concepts](/careers/entrepreneurship-small-business/growing-operating-a-business/basic-fundraising-concepts)**<br>/careers/entrepreneurship-small-business/growing-operating-a-business/basic-fundraising-concepts | Understanding equity, loans, and investor expectations.<br>*Key Tracks: Module 2: Basic Fundraising Concepts, Module 3: Basic Fundraising Concepts, Module 1: Basic Fundraising Concepts* | 3 Tracks |

---

### 12. Environmental Sustainability
- **Career Route**: /careers/environmental-sustainability
- **Description**: Work toward a more sustainable relationship between business and the environment.

#### 🛤️ Path 1: Sustainability Management
- **Path Route**: /careers/environmental-sustainability/sustainability-management
- **Path Scope**: Help organizations reduce environmental impact.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Sustainability Fundamentals](/careers/environmental-sustainability/sustainability-management/sustainability-fundamentals)**<br>/careers/environmental-sustainability/sustainability-management/sustainability-fundamentals | Core concepts in environmental and corporate sustainability.<br>*Key Tracks: Module 1: Sustainability Fundamentals, Module 2: Sustainability Fundamentals, Module 3: Sustainability Fundamentals* | 3 Tracks |
| 2 | **[Carbon Footprint Measurement](/careers/environmental-sustainability/sustainability-management/carbon-footprint-measurement)**<br>/careers/environmental-sustainability/sustainability-management/carbon-footprint-measurement | Quantifying an organization's emissions.<br>*Key Tracks: Module 3: Carbon Footprint Measurement, Module 1: Carbon Footprint Measurement, Module 2: Carbon Footprint Measurement* | 3 Tracks |
| 3 | **[ESG Reporting Basics](/careers/environmental-sustainability/sustainability-management/esg-reporting-basics)**<br>/careers/environmental-sustainability/sustainability-management/esg-reporting-basics | Environmental, social, and governance reporting standards.<br>*Key Tracks: Module 1: ESG Reporting Basics, Module 2: ESG Reporting Basics, Module 3: ESG Reporting Basics* | 3 Tracks |
| 4 | **[Sustainable Operations Strategy](/careers/environmental-sustainability/sustainability-management/sustainable-operations-strategy)**<br>/careers/environmental-sustainability/sustainability-management/sustainable-operations-strategy | Reducing waste and resource use in operations.<br>*Key Tracks: Module 2: Sustainable Operations Strategy, Module 3: Sustainable Operations Strategy, Module 1: Sustainable Operations Strategy* | 3 Tracks |

---

### 13. Fashion & Apparel
- **Career Route**: /careers/fashion-apparel
- **Description**: Design and produce clothing and accessories.

#### 🛤️ Path 1: Fashion Design Foundations
- **Path Route**: /careers/fashion-apparel/fashion-design-foundations
- **Path Scope**: Core skills for designing apparel from concept to sketch.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Fashion Sketching & Illustration](/careers/fashion-apparel/fashion-design-foundations/fashion-sketching-and-illustration)**<br>/careers/fashion-apparel/fashion-design-foundations/fashion-sketching-and-illustration | Communicating design ideas visually.<br>*Key Tracks: Module 1: Fashion Sketching & Illustration, Module 2: Fashion Sketching & Illustration, Module 3: Fashion Sketching & Illustration* | 3 Tracks |
| 2 | **[Textiles & Fabric Knowledge](/careers/fashion-apparel/fashion-design-foundations/textiles-and-fabric-knowledge)**<br>/careers/fashion-apparel/fashion-design-foundations/textiles-and-fabric-knowledge | Understanding fabric properties and uses.<br>*Key Tracks: Module 2: Textiles & Fabric Knowledge, Module 3: Textiles & Fabric Knowledge, Module 1: Textiles & Fabric Knowledge* | 3 Tracks |
| 3 | **[Pattern Making Basics](/careers/fashion-apparel/fashion-design-foundations/pattern-making-basics)**<br>/careers/fashion-apparel/fashion-design-foundations/pattern-making-basics | Turning designs into wearable patterns.<br>*Key Tracks: Module 1: Pattern Making Basics, Module 2: Pattern Making Basics, Module 4: Pattern Making Basics* | 4 Tracks |
| 4 | **[Garment Construction](/careers/fashion-apparel/fashion-design-foundations/garment-construction)**<br>/careers/fashion-apparel/fashion-design-foundations/garment-construction | Sewing and assembling garments from patterns.<br>*Key Tracks: Module 3: Garment Construction, Module 2: Garment Construction, Module 1: Garment Construction* | 3 Tracks |

---

### 14. Finance & Accounting
- **Career Route**: /careers/finance-accounting
- **Description**: Manage money, from bookkeeping to financial strategy.

#### 🛤️ Path 1: Accounting Foundations
- **Path Route**: /careers/finance-accounting/accounting-foundations
- **Path Scope**: Core bookkeeping and financial reporting skills.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Bookkeeping Basics](/careers/finance-accounting/accounting-foundations/bookkeeping-basics)**<br>/careers/finance-accounting/accounting-foundations/bookkeeping-basics | Recording transactions and maintaining ledgers.<br>*Key Tracks: Module 3: Bookkeeping Basics, Module 2: Bookkeeping Basics, Module 1: Bookkeeping Basics* | 3 Tracks |
| 2 | **[Financial Statements](/careers/finance-accounting/accounting-foundations/financial-statements)**<br>/careers/finance-accounting/accounting-foundations/financial-statements | Reading and preparing income statements and balance sheets.<br>*Key Tracks: Module 1: Financial Statements, Module 3: Financial Statements, Module 2: Financial Statements* | 3 Tracks |
| 3 | **[Accounts Payable & Receivable](/careers/finance-accounting/accounting-foundations/accounts-payable-and-receivable)**<br>/careers/finance-accounting/accounting-foundations/accounts-payable-and-receivable | Managing invoices, payments, and collections.<br>*Key Tracks: Module 3: Accounts Payable & Receivable, Module 1: Accounts Payable & Receivable, Module 2: Accounts Payable & Receivable* | 3 Tracks |
| 4 | **[Payroll Fundamentals](/careers/finance-accounting/accounting-foundations/payroll-fundamentals)**<br>/careers/finance-accounting/accounting-foundations/payroll-fundamentals | Processing payroll and understanding deductions.<br>*Key Tracks: Module 3: Payroll Fundamentals, Module 2: Payroll Fundamentals, Module 1: Payroll Fundamentals* | 3 Tracks |
| 5 | **[Accounting Software](/careers/finance-accounting/accounting-foundations/accounting-software)**<br>/careers/finance-accounting/accounting-foundations/accounting-software | Working in tools like QuickBooks or Xero.<br>*Key Tracks: Module 1: Accounting Software, Module 2: Accounting Software, Module 3: Accounting Software* | 3 Tracks |

#### 🛤️ Path 2: Financial Analysis
- **Path Route**: /careers/finance-accounting/financial-analysis
- **Path Scope**: Analyze numbers to guide business and investment decisions.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Financial Modeling](/careers/finance-accounting/financial-analysis/financial-modeling)**<br>/careers/finance-accounting/financial-analysis/financial-modeling | Building spreadsheet models for forecasting.<br>*Key Tracks: Module 3: Financial Modeling, Module 1: Financial Modeling, Module 2: Financial Modeling* | 4 Tracks |
| 2 | **[Valuation Basics](/careers/finance-accounting/financial-analysis/valuation-basics)**<br>/careers/finance-accounting/financial-analysis/valuation-basics | Estimating the worth of a company or asset.<br>*Key Tracks: Module 2: Valuation Basics, Module 1: Valuation Basics, Module 3: Valuation Basics* | 3 Tracks |
| 3 | **[Budgeting & Forecasting](/careers/finance-accounting/financial-analysis/budgeting-and-forecasting)**<br>/careers/finance-accounting/financial-analysis/budgeting-and-forecasting | Planning and tracking against financial targets.<br>*Key Tracks: Module 2: Budgeting & Forecasting, Module 3: Budgeting & Forecasting, Module 1: Budgeting & Forecasting* | 3 Tracks |
| 4 | **[Financial Ratio Analysis](/careers/finance-accounting/financial-analysis/financial-ratio-analysis)**<br>/careers/finance-accounting/financial-analysis/financial-ratio-analysis | Interpreting liquidity, profitability, and leverage ratios.<br>*Key Tracks: Module 2: Financial Ratio Analysis, Module 3: Financial Ratio Analysis, Module 1: Financial Ratio Analysis* | 3 Tracks |

---

### 15. Fitness & Personal Training
- **Career Route**: /careers/fitness-personal-training
- **Description**: Help people build strength, health, and healthy habits.

#### 🛤️ Path 1: Personal Training Foundations
- **Path Route**: /careers/fitness-personal-training/personal-training-foundations
- **Path Scope**: Core skills for coaching one-on-one fitness clients.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Exercise Science Basics](/careers/fitness-personal-training/personal-training-foundations/exercise-science-basics)**<br>/careers/fitness-personal-training/personal-training-foundations/exercise-science-basics | Anatomy and physiology relevant to training.<br>*Key Tracks: Module 3: Exercise Science Basics, Module 2: Exercise Science Basics, Module 1: Exercise Science Basics* | 3 Tracks |
| 2 | **[Program Design](/careers/fitness-personal-training/personal-training-foundations/program-design)**<br>/careers/fitness-personal-training/personal-training-foundations/program-design | Building safe, effective workout programs.<br>*Key Tracks: Module 3: Program Design, Module 2: Program Design, Module 1: Program Design* | 3 Tracks |
| 3 | **[Client Assessment & Goal Setting](/careers/fitness-personal-training/personal-training-foundations/client-assessment-and-goal-setting)**<br>/careers/fitness-personal-training/personal-training-foundations/client-assessment-and-goal-setting | Evaluating fitness levels and setting realistic goals.<br>*Key Tracks: Module 3: Client Assessment & Goal Setting, Module 1: Client Assessment & Goal Setting, Module 2: Client Assessment & Goal Setting* | 3 Tracks |
| 4 | **[Coaching & Motivation Techniques](/careers/fitness-personal-training/personal-training-foundations/coaching-and-motivation-techniques)**<br>/careers/fitness-personal-training/personal-training-foundations/coaching-and-motivation-techniques | Keeping clients engaged and progressing safely.<br>*Key Tracks: Module 3: Coaching & Motivation Techniques, Module 2: Coaching & Motivation Techniques, Module 1: Coaching & Motivation Techniques* | 3 Tracks |

---

### 16. Game Development
- **Career Route**: /careers/game-development
- **Description**: Design and build interactive games across platforms.

#### 🛤️ Path 1: Game Design Foundations
- **Path Route**: /careers/game-development/game-design-foundations
- **Path Scope**: Core skills for designing engaging game systems and experiences.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Game Design Principles](/careers/game-development/game-design-foundations/game-design-principles)**<br>/careers/game-development/game-design-foundations/game-design-principles | Mechanics, dynamics, and player experience fundamentals.<br>*Key Tracks: Module 2: Game Design Principles, Module 3: Game Design Principles, Module 1: Game Design Principles* | 3 Tracks |
| 2 | **[Level Design](/careers/game-development/game-design-foundations/level-design)**<br>/careers/game-development/game-design-foundations/level-design | Crafting spaces and challenges that guide players.<br>*Key Tracks: Module 2: Level Design, Module 3: Level Design, Module 1: Level Design* | 3 Tracks |
| 3 | **[Game Balancing](/careers/game-development/game-design-foundations/game-balancing)**<br>/careers/game-development/game-design-foundations/game-balancing | Tuning difficulty, economy, and progression.<br>*Key Tracks: Module 2: Game Balancing, Module 3: Game Balancing, Module 1: Game Balancing* | 3 Tracks |
| 4 | **[Prototyping Game Ideas](/careers/game-development/game-design-foundations/prototyping-game-ideas)**<br>/careers/game-development/game-design-foundations/prototyping-game-ideas | Quickly testing mechanics before full production.<br>*Key Tracks: Module 2: Prototyping Game Ideas, Module 3: Prototyping Game Ideas, Module 1: Prototyping Game Ideas* | 3 Tracks |
| 5 | **[Narrative Design Basics](/careers/game-development/game-design-foundations/narrative-design-basics)**<br>/careers/game-development/game-design-foundations/narrative-design-basics | Weaving story into interactive systems.<br>*Key Tracks: Module 2: Narrative Design Basics, Module 1: Narrative Design Basics* | 2 Tracks |

#### 🛤️ Path 2: Game Programming
- **Path Route**: /careers/game-development/game-programming
- **Path Scope**: Build the code that brings games to life.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Programming Fundamentals for Games](/careers/game-development/game-programming/programming-fundamentals-for-games)**<br>/careers/game-development/game-programming/programming-fundamentals-for-games | Core coding concepts applied to game logic.<br>*Key Tracks: Module 3: Programming Fundamentals for Games, Module 2: Programming Fundamentals for Games, Module 4: Programming Fundamentals for Games* | 4 Tracks |
| 2 | **[Game Engine Basics (Unity/Unreal)](/careers/game-development/game-programming/game-engine-basics-unity-and-unreal)**<br>/careers/game-development/game-programming/game-engine-basics-unity-and-unreal | Building playable scenes in a modern game engine.<br>*Key Tracks: Module 4: Game Engine Basics (Unity/Unreal), Module 2: Game Engine Basics (Unity/Unreal), Module 5: Game Engine Basics (Unity/Unreal)* | 5 Tracks |
| 3 | **[Physics & Collision Systems](/careers/game-development/game-programming/physics-and-collision-systems)**<br>/careers/game-development/game-programming/physics-and-collision-systems | Implementing realistic or stylized game physics.<br>*Key Tracks: Module 3: Physics & Collision Systems, Module 1: Physics & Collision Systems, Module 2: Physics & Collision Systems* | 3 Tracks |
| 4 | **[Game Performance Optimization](/careers/game-development/game-programming/game-performance-optimization)**<br>/careers/game-development/game-programming/game-performance-optimization | Keeping games running smoothly across devices.<br>*Key Tracks: Module 3: Game Performance Optimization, Module 2: Game Performance Optimization, Module 1: Game Performance Optimization* | 3 Tracks |
| 5 | **[Multiplayer & Networking Basics](/careers/game-development/game-programming/multiplayer-and-networking-basics)**<br>/careers/game-development/game-programming/multiplayer-and-networking-basics | Fundamentals of connecting players online.<br>*Key Tracks: Module 1: Multiplayer & Networking Basics, Module 3: Multiplayer & Networking Basics, Module 2: Multiplayer & Networking Basics* | 3 Tracks |

#### 🛤️ Path 3: Game Art & Animation
- **Path Route**: /careers/game-development/game-art-animation
- **Path Scope**: Create the visual assets and animation that define a game's look.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[2D Game Art Fundamentals](/careers/game-development/game-art-animation/2d-game-art-fundamentals)**<br>/careers/game-development/game-art-animation/2d-game-art-fundamentals | Sprites, tiles, and stylized 2D visuals.<br>*Key Tracks: Module 2: 2D Game Art Fundamentals, Module 1: 2D Game Art Fundamentals, Module 3: 2D Game Art Fundamentals* | 3 Tracks |
| 2 | **[3D Modeling for Games](/careers/game-development/game-art-animation/3d-modeling-for-games)**<br>/careers/game-development/game-art-animation/3d-modeling-for-games | Building game-ready 3D assets.<br>*Key Tracks: Module 1: 3D Modeling for Games, Module 4: 3D Modeling for Games, Module 2: 3D Modeling for Games* | 4 Tracks |
| 3 | **[Texturing & Materials](/careers/game-development/game-art-animation/texturing-and-materials)**<br>/careers/game-development/game-art-animation/texturing-and-materials | Making 3D models look realistic or stylized.<br>*Key Tracks: Module 2: Texturing & Materials, Module 3: Texturing & Materials, Module 1: Texturing & Materials* | 3 Tracks |
| 4 | **[Character & Environment Animation](/careers/game-development/game-art-animation/character-and-environment-animation)**<br>/careers/game-development/game-art-animation/character-and-environment-animation | Bringing characters and worlds to life in motion.<br>*Key Tracks: Module 3: Character & Environment Animation, Module 2: Character & Environment Animation, Module 1: Character & Environment Animation* | 3 Tracks |

---

### 17. Graphic Design & Visual Media
- **Career Route**: /careers/graphic-design-visual-media
- **Description**: Communicate visually across print, digital, and motion media.

#### 🛤️ Path 1: Graphic Design Foundations
- **Path Route**: /careers/graphic-design-visual-media/graphic-design-foundations
- **Path Scope**: Core visual design skills for branding and marketing materials.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Design Principles](/careers/graphic-design-visual-media/graphic-design-foundations/design-principles)**<br>/careers/graphic-design-visual-media/graphic-design-foundations/design-principles | Balance, contrast, hierarchy, and composition.<br>*Key Tracks: Module 3: Design Principles, Module 1: Design Principles, Module 2: Design Principles* | 3 Tracks |
| 2 | **[Typography](/careers/graphic-design-visual-media/graphic-design-foundations/typography)**<br>/careers/graphic-design-visual-media/graphic-design-foundations/typography | Choosing and pairing type for impact and readability.<br>*Key Tracks: Module 1: Typography, Module 2: Typography, Module 3: Typography* | 3 Tracks |
| 3 | **[Adobe Illustrator & Photoshop](/careers/graphic-design-visual-media/graphic-design-foundations/adobe-illustrator-and-photoshop)**<br>/careers/graphic-design-visual-media/graphic-design-foundations/adobe-illustrator-and-photoshop | Vector and raster design tools in practice.<br>*Key Tracks: Module 1: Adobe Illustrator & Photoshop, Module 3: Adobe Illustrator & Photoshop, Module 4: Adobe Illustrator & Photoshop* | 4 Tracks |
| 4 | **[Branding & Logo Design](/careers/graphic-design-visual-media/graphic-design-foundations/branding-and-logo-design)**<br>/careers/graphic-design-visual-media/graphic-design-foundations/branding-and-logo-design | Designing cohesive visual identities.<br>*Key Tracks: Module 2: Branding & Logo Design, Module 3: Branding & Logo Design, Module 1: Branding & Logo Design* | 3 Tracks |

#### 🛤️ Path 2: Video Editing & Motion Graphics
- **Path Route**: /careers/graphic-design-visual-media/video-editing-motion-graphics
- **Path Scope**: Tell stories through edited video and animated visuals.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Video Editing Fundamentals](/careers/graphic-design-visual-media/video-editing-motion-graphics/video-editing-fundamentals)**<br>/careers/graphic-design-visual-media/video-editing-motion-graphics/video-editing-fundamentals | Cutting, pacing, and structuring footage.<br>*Key Tracks: Module 2: Video Editing Fundamentals, Module 3: Video Editing Fundamentals, Module 1: Video Editing Fundamentals* | 4 Tracks |
| 2 | **[Adobe Premiere Pro](/careers/graphic-design-visual-media/video-editing-motion-graphics/adobe-premiere-pro)**<br>/careers/graphic-design-visual-media/video-editing-motion-graphics/adobe-premiere-pro | Professional non-linear video editing.<br>*Key Tracks: Module 1: Adobe Premiere Pro, Module 2: Adobe Premiere Pro, Module 3: Adobe Premiere Pro* | 4 Tracks |
| 3 | **[Motion Graphics with After Effects](/careers/graphic-design-visual-media/video-editing-motion-graphics/motion-graphics-with-after-effects)**<br>/careers/graphic-design-visual-media/video-editing-motion-graphics/motion-graphics-with-after-effects | Animated titles, transitions, and visual effects.<br>*Key Tracks: Module 2: Motion Graphics with After Effects, Module 4: Motion Graphics with After Effects, Module 3: Motion Graphics with After Effects* | 4 Tracks |
| 4 | **[Color Grading & Audio Basics](/careers/graphic-design-visual-media/video-editing-motion-graphics/color-grading-and-audio-basics)**<br>/careers/graphic-design-visual-media/video-editing-motion-graphics/color-grading-and-audio-basics | Polishing the look and sound of a final cut.<br>*Key Tracks: Module 2: Color Grading & Audio Basics, Module 3: Color Grading & Audio Basics, Module 1: Color Grading & Audio Basics* | 3 Tracks |

---

### 18. Healthcare Support
- **Career Route**: /careers/healthcare-support
- **Description**: Skills for allied and support roles across healthcare settings.

#### 🛤️ Path 1: Medical Administration
- **Path Route**: /careers/healthcare-support/medical-administration
- **Path Scope**: Keep clinical and administrative operations running smoothly.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Medical Terminology](/careers/healthcare-support/medical-administration/medical-terminology)**<br>/careers/healthcare-support/medical-administration/medical-terminology | Common clinical vocabulary and abbreviations.<br>*Key Tracks: Module 3: Medical Terminology, Module 1: Medical Terminology, Module 2: Medical Terminology* | 3 Tracks |
| 2 | **[Health Records Management](/careers/healthcare-support/medical-administration/health-records-management)**<br>/careers/healthcare-support/medical-administration/health-records-management | Handling patient records accurately and confidentially.<br>*Key Tracks: Module 2: Health Records Management, Module 3: Health Records Management, Module 1: Health Records Management* | 3 Tracks |
| 3 | **[Medical Billing & Coding Basics](/careers/healthcare-support/medical-administration/medical-billing-and-coding-basics)**<br>/careers/healthcare-support/medical-administration/medical-billing-and-coding-basics | Understanding claims, codes, and insurance basics.<br>*Key Tracks: Module 2: Medical Billing & Coding Basics, Module 3: Medical Billing & Coding Basics, Module 1: Medical Billing & Coding Basics* | 3 Tracks |
| 4 | **[Patient Communication](/careers/healthcare-support/medical-administration/patient-communication)**<br>/careers/healthcare-support/medical-administration/patient-communication | Professional, empathetic front-desk interactions.<br>*Key Tracks: Module 2: Patient Communication, Module 1: Patient Communication* | 2 Tracks |

#### 🛤️ Path 2: Patient Care Fundamentals
- **Path Route**: /careers/healthcare-support/patient-care-fundamentals
- **Path Scope**: Foundational skills for direct patient support roles.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Vital Signs & Basic Assessment](/careers/healthcare-support/patient-care-fundamentals/vital-signs-and-basic-assessment)**<br>/careers/healthcare-support/patient-care-fundamentals/vital-signs-and-basic-assessment | Measuring and recording basic patient indicators.<br>*Key Tracks: Module 2: Vital Signs & Basic Assessment, Module 3: Vital Signs & Basic Assessment, Module 1: Vital Signs & Basic Assessment* | 3 Tracks |
| 2 | **[Infection Control](/careers/healthcare-support/patient-care-fundamentals/infection-control)**<br>/careers/healthcare-support/patient-care-fundamentals/infection-control | Hygiene, sterilization, and safety protocols.<br>*Key Tracks: Module 2: Infection Control, Module 3: Infection Control, Module 1: Infection Control* | 3 Tracks |
| 3 | **[Patient Safety & Mobility Support](/careers/healthcare-support/patient-care-fundamentals/patient-safety-and-mobility-support)**<br>/careers/healthcare-support/patient-care-fundamentals/patient-safety-and-mobility-support | Assisting patients safely and comfortably.<br>*Key Tracks: Module 1: Patient Safety & Mobility Support, Module 2: Patient Safety & Mobility Support, Module 3: Patient Safety & Mobility Support* | 3 Tracks |
| 4 | **[Emergency Response Basics](/careers/healthcare-support/patient-care-fundamentals/emergency-response-basics)**<br>/careers/healthcare-support/patient-care-fundamentals/emergency-response-basics | First response until professional help arrives.<br>*Key Tracks: Module 2: Emergency Response Basics, Module 3: Emergency Response Basics, Module 1: Emergency Response Basics* | 3 Tracks |

---

### 19. Human Resources
- **Career Route**: /careers/human-resources
- **Description**: Hire, develop, and support the people inside organizations.

#### 🛤️ Path 1: Talent Acquisition
- **Path Route**: /careers/human-resources/talent-acquisition
- **Path Scope**: Find and hire the right people for the right roles.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Sourcing & Recruiting](/careers/human-resources/talent-acquisition/sourcing-and-recruiting)**<br>/careers/human-resources/talent-acquisition/sourcing-and-recruiting | Finding candidates across channels.<br>*Key Tracks: Module 2: Sourcing & Recruiting, Module 3: Sourcing & Recruiting, Module 1: Sourcing & Recruiting* | 3 Tracks |
| 2 | **[Interviewing Techniques](/careers/human-resources/talent-acquisition/interviewing-techniques)**<br>/careers/human-resources/talent-acquisition/interviewing-techniques | Structured interviews that reduce bias.<br>*Key Tracks: Module 3: Interviewing Techniques, Module 1: Interviewing Techniques, Module 2: Interviewing Techniques* | 3 Tracks |
| 3 | **[Employer Branding](/careers/human-resources/talent-acquisition/employer-branding)**<br>/careers/human-resources/talent-acquisition/employer-branding | Positioning a company as a place people want to work.<br>*Key Tracks: Module 2: Employer Branding, Module 1: Employer Branding* | 2 Tracks |
| 4 | **[Offer Negotiation & Onboarding](/careers/human-resources/talent-acquisition/offer-negotiation-and-onboarding)**<br>/careers/human-resources/talent-acquisition/offer-negotiation-and-onboarding | Closing candidates and setting them up to succeed.<br>*Key Tracks: Module 1: Offer Negotiation & Onboarding, Module 2: Offer Negotiation & Onboarding, Module 3: Offer Negotiation & Onboarding* | 3 Tracks |

#### 🛤️ Path 2: People Operations
- **Path Route**: /careers/human-resources/people-operations
- **Path Scope**: Support employees and keep HR operations running smoothly.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[HR Policies & Compliance](/careers/human-resources/people-operations/hr-policies-and-compliance)**<br>/careers/human-resources/people-operations/hr-policies-and-compliance | Employment law basics and policy design.<br>*Key Tracks: Module 3: HR Policies & Compliance, Module 1: HR Policies & Compliance, Module 2: HR Policies & Compliance* | 3 Tracks |
| 2 | **[Performance Management](/careers/human-resources/people-operations/performance-management)**<br>/careers/human-resources/people-operations/performance-management | Running reviews and feedback cycles.<br>*Key Tracks: Module 3: Performance Management, Module 2: Performance Management, Module 1: Performance Management* | 3 Tracks |
| 3 | **[Compensation & Benefits Basics](/careers/human-resources/people-operations/compensation-and-benefits-basics)**<br>/careers/human-resources/people-operations/compensation-and-benefits-basics | Structuring pay and benefits fairly.<br>*Key Tracks: Module 3: Compensation & Benefits Basics, Module 2: Compensation & Benefits Basics, Module 1: Compensation & Benefits Basics* | 3 Tracks |
| 4 | **[Employee Engagement](/careers/human-resources/people-operations/employee-engagement)**<br>/careers/human-resources/people-operations/employee-engagement | Measuring and improving workplace satisfaction.<br>*Key Tracks: Module 3: Employee Engagement, Module 1: Employee Engagement, Module 2: Employee Engagement* | 3 Tracks |

---

### 20. Insurance
- **Career Route**: /careers/insurance
- **Description**: Assess and manage risk through insurance products.

#### 🛤️ Path 1: Insurance Sales & Underwriting Basics
- **Path Route**: /careers/insurance/insurance-sales-underwriting-basics
- **Path Scope**: Core skills for selling and evaluating insurance policies.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Insurance Fundamentals](/careers/insurance/insurance-sales-underwriting-basics/insurance-fundamentals)**<br>/careers/insurance/insurance-sales-underwriting-basics/insurance-fundamentals | Core concepts of risk, premiums, and coverage.<br>*Key Tracks: Module 2: Insurance Fundamentals, Module 3: Insurance Fundamentals, Module 1: Insurance Fundamentals* | 3 Tracks |
| 2 | **[Policy Types & Underwriting Basics](/careers/insurance/insurance-sales-underwriting-basics/policy-types-and-underwriting-basics)**<br>/careers/insurance/insurance-sales-underwriting-basics/policy-types-and-underwriting-basics | How policies are evaluated and priced.<br>*Key Tracks: Module 2: Policy Types & Underwriting Basics, Module 3: Policy Types & Underwriting Basics, Module 1: Policy Types & Underwriting Basics* | 3 Tracks |
| 3 | **[Claims Process Basics](/careers/insurance/insurance-sales-underwriting-basics/claims-process-basics)**<br>/careers/insurance/insurance-sales-underwriting-basics/claims-process-basics | How claims are filed, reviewed, and settled.<br>*Key Tracks: Module 2: Claims Process Basics, Module 1: Claims Process Basics* | 2 Tracks |
| 4 | **[Client Needs Assessment & Sales](/careers/insurance/insurance-sales-underwriting-basics/client-needs-assessment-and-sales)**<br>/careers/insurance/insurance-sales-underwriting-basics/client-needs-assessment-and-sales | Matching clients to appropriate coverage.<br>*Key Tracks: Module 2: Client Needs Assessment & Sales, Module 3: Client Needs Assessment & Sales, Module 1: Client Needs Assessment & Sales* | 3 Tracks |

---

### 21. Interior Design
- **Career Route**: /careers/interior-design
- **Description**: Design functional, beautiful indoor spaces.

#### 🛤️ Path 1: Interior Design Foundations
- **Path Route**: /careers/interior-design/interior-design-foundations
- **Path Scope**: Core skills for designing residential and commercial interiors.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Space Planning](/careers/interior-design/interior-design-foundations/space-planning)**<br>/careers/interior-design/interior-design-foundations/space-planning | Arranging layouts for function and flow.<br>*Key Tracks: Module 1: Space Planning, Module 3: Space Planning, Module 2: Space Planning* | 3 Tracks |
| 2 | **[Color & Material Selection](/careers/interior-design/interior-design-foundations/color-and-material-selection)**<br>/careers/interior-design/interior-design-foundations/color-and-material-selection | Choosing finishes that suit a space's purpose and mood.<br>*Key Tracks: Module 2: Color & Material Selection, Module 1: Color & Material Selection, Module 3: Color & Material Selection* | 3 Tracks |
| 3 | **[Interior Design Software](/careers/interior-design/interior-design-foundations/interior-design-software)**<br>/careers/interior-design/interior-design-foundations/interior-design-software | Producing floor plans and renders digitally.<br>*Key Tracks: Module 1: Interior Design Software, Module 3: Interior Design Software, Module 2: Interior Design Software* | 3 Tracks |
| 4 | **[Furniture & Fixtures Sourcing](/careers/interior-design/interior-design-foundations/furniture-and-fixtures-sourcing)**<br>/careers/interior-design/interior-design-foundations/furniture-and-fixtures-sourcing | Selecting and specifying furnishings within budget.<br>*Key Tracks: Module 1: Furniture & Fixtures Sourcing, Module 2: Furniture & Fixtures Sourcing* | 2 Tracks |
| 5 | **[Client Presentations](/careers/interior-design/interior-design-foundations/client-presentations)**<br>/careers/interior-design/interior-design-foundations/client-presentations | Presenting design concepts persuasively to clients.<br>*Key Tracks: Module 2: Client Presentations, Module 1: Client Presentations* | 2 Tracks |

---

### 22. IT & Technical Support
- **Career Route**: /careers/it-and-technical-support
- **Description**: Keep people and their technology working, from hardware to help desk.

#### 🛤️ Path 1: Help Desk & IT Support Foundations
- **Path Route**: /careers/it-and-technical-support/help-desk-and-it-support-foundations
- **Path Scope**: Core skills for resolving everyday technology problems for users.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Computer Hardware Basics](/careers/it-and-technical-support/help-desk-and-it-support-foundations/computer-hardware-basics)**<br>/careers/it-and-technical-support/help-desk-and-it-support-foundations/computer-hardware-basics | Understanding core components and common hardware issues.<br>*Key Tracks: Module 1: Computer Hardware Basics, Module 2: Computer Hardware Basics, Module 3: Computer Hardware Basics* | 3 Tracks |
| 2 | **[Operating System Troubleshooting](/careers/it-and-technical-support/help-desk-and-it-support-foundations/operating-system-troubleshooting)**<br>/careers/it-and-technical-support/help-desk-and-it-support-foundations/operating-system-troubleshooting | Diagnosing and fixing common Windows/Mac OS problems.<br>*Key Tracks: Module 1: Operating System Troubleshooting, Module 2: Operating System Troubleshooting, Module 3: Operating System Troubleshooting* | 3 Tracks |
| 3 | **[Networking for Support Technicians](/careers/it-and-technical-support/help-desk-and-it-support-foundations/networking-for-support-technicians)**<br>/careers/it-and-technical-support/help-desk-and-it-support-foundations/networking-for-support-technicians | Basic connectivity troubleshooting for end users.<br>*Key Tracks: Module 1: Networking for Support Technicians, Module 2: Networking for Support Technicians, Module 3: Networking for Support Technicians* | 3 Tracks |
| 4 | **[Ticketing & Customer Service](/careers/it-and-technical-support/help-desk-and-it-support-foundations/ticketing-and-customer-service)**<br>/careers/it-and-technical-support/help-desk-and-it-support-foundations/ticketing-and-customer-service | Managing support tickets and communicating clearly with users.<br>*Key Tracks: Module 1: Ticketing & Customer Service, Module 2: Ticketing & Customer Service* | 2 Tracks |
| 5 | **[Remote Support Tools](/careers/it-and-technical-support/help-desk-and-it-support-foundations/remote-support-tools)**<br>/careers/it-and-technical-support/help-desk-and-it-support-foundations/remote-support-tools | Diagnosing and fixing issues on remote machines.<br>*Key Tracks: Module 1: Remote Support Tools, Module 2: Remote Support Tools* | 2 Tracks |

---

### 23. Journalism & Writing
- **Career Route**: /careers/journalism-writing
- **Description**: Research, report, and write for an audience.

#### 🛤️ Path 1: News Journalism
- **Path Route**: /careers/journalism-writing/news-journalism
- **Path Scope**: Report accurate, timely news stories.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[News Writing Fundamentals](/careers/journalism-writing/news-journalism/news-writing-fundamentals)**<br>/careers/journalism-writing/news-journalism/news-writing-fundamentals | Structuring clear, fact-first news stories.<br>*Key Tracks: Module 1: News Writing Fundamentals, Module 2: News Writing Fundamentals, Module 3: News Writing Fundamentals* | 3 Tracks |
| 2 | **[Interviewing Sources](/careers/journalism-writing/news-journalism/interviewing-sources)**<br>/careers/journalism-writing/news-journalism/interviewing-sources | Getting useful, quotable information from people.<br>*Key Tracks: Module 1: Interviewing Sources, Module 3: Interviewing Sources, Module 2: Interviewing Sources* | 3 Tracks |
| 3 | **[Fact-Checking & Verification](/careers/journalism-writing/news-journalism/fact-checking-and-verification)**<br>/careers/journalism-writing/news-journalism/fact-checking-and-verification | Confirming accuracy before publishing.<br>*Key Tracks: Module 2: Fact-Checking & Verification, Module 1: Fact-Checking & Verification, Module 3: Fact-Checking & Verification* | 3 Tracks |
| 4 | **[Media Ethics & Law Basics](/careers/journalism-writing/news-journalism/media-ethics-and-law-basics)**<br>/careers/journalism-writing/news-journalism/media-ethics-and-law-basics | Working within legal and ethical journalism standards.<br>*Key Tracks: Module 3: Media Ethics & Law Basics, Module 2: Media Ethics & Law Basics, Module 1: Media Ethics & Law Basics* | 3 Tracks |

#### 🛤️ Path 2: Freelance & Content Writing
- **Path Route**: /careers/journalism-writing/freelance-content-writing
- **Path Scope**: Write professionally across formats for varied clients.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Writing Craft & Editing](/careers/journalism-writing/freelance-content-writing/writing-craft-and-editing)**<br>/careers/journalism-writing/freelance-content-writing/writing-craft-and-editing | Producing clean, engaging prose across formats.<br>*Key Tracks: Module 3: Writing Craft & Editing, Module 2: Writing Craft & Editing, Module 1: Writing Craft & Editing* | 3 Tracks |
| 2 | **[Pitching & Client Communication](/careers/journalism-writing/freelance-content-writing/pitching-and-client-communication)**<br>/careers/journalism-writing/freelance-content-writing/pitching-and-client-communication | Landing and managing freelance writing work.<br>*Key Tracks: Module 2: Pitching & Client Communication, Module 1: Pitching & Client Communication* | 2 Tracks |
| 3 | **[SEO Writing Basics](/careers/journalism-writing/freelance-content-writing/seo-writing-basics)**<br>/careers/journalism-writing/freelance-content-writing/seo-writing-basics | Writing content that also performs in search.<br>*Key Tracks: Module 2: SEO Writing Basics, Module 1: SEO Writing Basics* | 2 Tracks |
| 4 | **[Freelance Business Basics](/careers/journalism-writing/freelance-content-writing/freelance-business-basics)**<br>/careers/journalism-writing/freelance-content-writing/freelance-business-basics | Pricing, contracts, and managing freelance income.<br>*Key Tracks: Module 1: Freelance Business Basics, Module 2: Freelance Business Basics, Module 3: Freelance Business Basics* | 3 Tracks |

---

### 24. Laboratory Science
- **Career Route**: /careers/laboratory-science
- **Description**: Conduct and support scientific testing and research in lab settings.

#### 🛤️ Path 1: Lab Technician Foundations
- **Path Route**: /careers/laboratory-science/lab-technician-foundations
- **Path Scope**: Core skills for working safely and accurately in a lab.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Lab Safety & Compliance](/careers/laboratory-science/lab-technician-foundations/lab-safety-and-compliance)**<br>/careers/laboratory-science/lab-technician-foundations/lab-safety-and-compliance | Handling chemicals and equipment safely.<br>*Key Tracks: Module 1: Lab Safety & Compliance, Module 2: Lab Safety & Compliance, Module 3: Lab Safety & Compliance* | 3 Tracks |
| 2 | **[Sample Handling & Preparation](/careers/laboratory-science/lab-technician-foundations/sample-handling-and-preparation)**<br>/careers/laboratory-science/lab-technician-foundations/sample-handling-and-preparation | Preparing and processing samples accurately.<br>*Key Tracks: Module 2: Sample Handling & Preparation, Module 3: Sample Handling & Preparation, Module 1: Sample Handling & Preparation* | 3 Tracks |
| 3 | **[Lab Equipment Operation](/careers/laboratory-science/lab-technician-foundations/lab-equipment-operation)**<br>/careers/laboratory-science/lab-technician-foundations/lab-equipment-operation | Using common lab instruments correctly.<br>*Key Tracks: Module 3: Lab Equipment Operation, Module 1: Lab Equipment Operation, Module 2: Lab Equipment Operation* | 3 Tracks |
| 4 | **[Data Recording & Lab Reporting](/careers/laboratory-science/lab-technician-foundations/data-recording-and-lab-reporting)**<br>/careers/laboratory-science/lab-technician-foundations/data-recording-and-lab-reporting | Accurately documenting experiments and results.<br>*Key Tracks: Module 2: Data Recording & Lab Reporting, Module 1: Data Recording & Lab Reporting* | 2 Tracks |
| 5 | **[Quality Control in Lab Testing](/careers/laboratory-science/lab-technician-foundations/quality-control-in-lab-testing)**<br>/careers/laboratory-science/lab-technician-foundations/quality-control-in-lab-testing | Ensuring consistent, reliable lab results.<br>*Key Tracks: Module 1: Quality Control in Lab Testing, Module 2: Quality Control in Lab Testing* | 2 Tracks |

---

### 25. Legal Support
- **Career Route**: /careers/legal-support
- **Description**: Skills for paralegal and legal-adjacent support roles.

#### 🛤️ Path 1: Paralegal Foundations
- **Path Route**: /careers/legal-support/paralegal-foundations
- **Path Scope**: Core skills for supporting attorneys and legal teams.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Legal Terminology & Research](/careers/legal-support/paralegal-foundations/legal-terminology-and-research)**<br>/careers/legal-support/paralegal-foundations/legal-terminology-and-research | Understanding legal language and finding case law.<br>*Key Tracks: Module 3: Legal Terminology & Research, Module 2: Legal Terminology & Research, Module 1: Legal Terminology & Research* | 3 Tracks |
| 2 | **[Document Drafting](/careers/legal-support/paralegal-foundations/document-drafting)**<br>/careers/legal-support/paralegal-foundations/document-drafting | Preparing contracts, briefs, and legal correspondence.<br>*Key Tracks: Module 2: Document Drafting, Module 3: Document Drafting, Module 1: Document Drafting* | 3 Tracks |
| 3 | **[Case Management](/careers/legal-support/paralegal-foundations/case-management)**<br>/careers/legal-support/paralegal-foundations/case-management | Organizing files, deadlines, and case timelines.<br>*Key Tracks: Module 3: Case Management, Module 1: Case Management, Module 2: Case Management* | 3 Tracks |
| 4 | **[Legal Ethics & Confidentiality](/careers/legal-support/paralegal-foundations/legal-ethics-and-confidentiality)**<br>/careers/legal-support/paralegal-foundations/legal-ethics-and-confidentiality | Professional responsibility in legal work.<br>*Key Tracks: Module 2: Legal Ethics & Confidentiality, Module 1: Legal Ethics & Confidentiality, Module 3: Legal Ethics & Confidentiality* | 3 Tracks |

---

### 26. Library & Information Science
- **Career Route**: /careers/library-information-science
- **Description**: Organize, manage, and provide access to information and knowledge.

#### 🛤️ Path 1: Library & Information Services
- **Path Route**: /careers/library-information-science/library-information-services
- **Path Scope**: Core skills for managing collections and helping patrons find information.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Information Organization & Cataloging](/careers/library-information-science/library-information-services/information-organization-and-cataloging)**<br>/careers/library-information-science/library-information-services/information-organization-and-cataloging | Classifying and organizing materials for retrieval.<br>*Key Tracks: Module 2: Information Organization & Cataloging, Module 3: Information Organization & Cataloging, Module 1: Information Organization & Cataloging* | 3 Tracks |
| 2 | **[Reference & Research Assistance](/careers/library-information-science/library-information-services/reference-and-research-assistance)**<br>/careers/library-information-science/library-information-services/reference-and-research-assistance | Helping patrons find accurate, relevant information.<br>*Key Tracks: Module 2: Reference & Research Assistance, Module 3: Reference & Research Assistance, Module 1: Reference & Research Assistance* | 3 Tracks |
| 3 | **[Digital Resource Management](/careers/library-information-science/library-information-services/digital-resource-management)**<br>/careers/library-information-science/library-information-services/digital-resource-management | Managing e-resources and digital archives.<br>*Key Tracks: Module 1: Digital Resource Management, Module 2: Digital Resource Management, Module 3: Digital Resource Management* | 3 Tracks |
| 4 | **[Community Programming](/careers/library-information-science/library-information-services/community-programming)**<br>/careers/library-information-science/library-information-services/community-programming | Planning events and programs that serve the community.<br>*Key Tracks: Module 2: Community Programming, Module 1: Community Programming* | 2 Tracks |

---

### 27. Manufacturing & Quality
- **Career Route**: /careers/manufacturing-quality
- **Description**: Produce goods efficiently and to consistent quality standards.

#### 🛤️ Path 1: Manufacturing Operations
- **Path Route**: /careers/manufacturing-quality/manufacturing-operations
- **Path Scope**: Run efficient, safe production line operations.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Production Process Fundamentals](/careers/manufacturing-quality/manufacturing-operations/production-process-fundamentals)**<br>/careers/manufacturing-quality/manufacturing-operations/production-process-fundamentals | How manufacturing workflows are structured.<br>*Key Tracks: Module 1: Production Process Fundamentals, Module 3: Production Process Fundamentals, Module 2: Production Process Fundamentals* | 3 Tracks |
| 2 | **[Lean Manufacturing Basics](/careers/manufacturing-quality/manufacturing-operations/lean-manufacturing-basics)**<br>/careers/manufacturing-quality/manufacturing-operations/lean-manufacturing-basics | Reducing waste and improving efficiency.<br>*Key Tracks: Module 2: Lean Manufacturing Basics, Module 3: Lean Manufacturing Basics, Module 1: Lean Manufacturing Basics* | 3 Tracks |
| 3 | **[Workplace Safety in Manufacturing](/careers/manufacturing-quality/manufacturing-operations/workplace-safety-in-manufacturing)**<br>/careers/manufacturing-quality/manufacturing-operations/workplace-safety-in-manufacturing | Safe operation of equipment and environments.<br>*Key Tracks: Module 3: Workplace Safety in Manufacturing, Module 2: Workplace Safety in Manufacturing, Module 1: Workplace Safety in Manufacturing* | 3 Tracks |
| 4 | **[Quality Control Fundamentals](/careers/manufacturing-quality/manufacturing-operations/quality-control-fundamentals)**<br>/careers/manufacturing-quality/manufacturing-operations/quality-control-fundamentals | Inspecting and maintaining product quality standards.<br>*Key Tracks: Module 2: Quality Control Fundamentals, Module 3: Quality Control Fundamentals, Module 1: Quality Control Fundamentals* | 3 Tracks |

---

### 28. Mental Health Counseling
- **Career Route**: /careers/mental-health-counseling
- **Description**: Provide structured, ethical support to people navigating mental health challenges.

#### 🛤️ Path 1: Clinical Counseling Foundations
- **Path Route**: /careers/mental-health-counseling/clinical-counseling-foundations
- **Path Scope**: Core clinical skills for supportive, ethical counseling practice.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Counseling Theories & Approaches](/careers/mental-health-counseling/clinical-counseling-foundations/counseling-theories-and-approaches)**<br>/careers/mental-health-counseling/clinical-counseling-foundations/counseling-theories-and-approaches | Major frameworks that guide counseling practice.<br>*Key Tracks: Module 3: Counseling Theories & Approaches, Module 1: Counseling Theories & Approaches, Module 2: Counseling Theories & Approaches* | 3 Tracks |
| 2 | **[Trauma-Informed & Crisis Care](/careers/mental-health-counseling/clinical-counseling-foundations/trauma-informed-and-crisis-care)**<br>/careers/mental-health-counseling/clinical-counseling-foundations/trauma-informed-and-crisis-care | Responding safely and sensitively to trauma and crisis.<br>*Key Tracks: Module 1: Trauma-Informed & Crisis Care, Module 2: Trauma-Informed & Crisis Care, Module 3: Trauma-Informed & Crisis Care* | 3 Tracks |
| 3 | **[Group Facilitation Basics](/careers/mental-health-counseling/clinical-counseling-foundations/group-facilitation-basics)**<br>/careers/mental-health-counseling/clinical-counseling-foundations/group-facilitation-basics | Running supportive group sessions effectively.<br>*Key Tracks: Module 2: Group Facilitation Basics, Module 3: Group Facilitation Basics, Module 1: Group Facilitation Basics* | 3 Tracks |
| 4 | **[Clinical Documentation & Ethics](/careers/mental-health-counseling/clinical-counseling-foundations/clinical-documentation-and-ethics)**<br>/careers/mental-health-counseling/clinical-counseling-foundations/clinical-documentation-and-ethics | Keeping accurate records within ethical and legal bounds.<br>*Key Tracks: Module 3: Clinical Documentation & Ethics, Module 1: Clinical Documentation & Ethics, Module 2: Clinical Documentation & Ethics* | 3 Tracks |

---

### 29. Mobile App Development
- **Career Route**: /careers/mobile-app-development
- **Description**: Design and build native and cross-platform mobile applications.

#### 🛤️ Path 1: Cross-Platform Mobile Development
- **Path Route**: /careers/mobile-app-development/cross-platform-mobile-development
- **Path Scope**: Build apps that run on both iOS and Android from one codebase.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Mobile UI Fundamentals](/careers/mobile-app-development/cross-platform-mobile-development/mobile-ui-fundamentals)**<br>/careers/mobile-app-development/cross-platform-mobile-development/mobile-ui-fundamentals | Designing touch-friendly interfaces for small screens.<br>*Key Tracks: Module 3: Mobile UI Fundamentals, Module 1: Mobile UI Fundamentals, Module 2: Mobile UI Fundamentals* | 3 Tracks |
| 2 | **[React Native or Flutter Basics](/careers/mobile-app-development/cross-platform-mobile-development/react-native-or-flutter-basics)**<br>/careers/mobile-app-development/cross-platform-mobile-development/react-native-or-flutter-basics | Building cross-platform apps with a shared codebase.<br>*Key Tracks: Module 1: React Native or Flutter Basics, Module 4: React Native or Flutter Basics, Module 2: React Native or Flutter Basics* | 4 Tracks |
| 3 | **[Mobile State & Navigation](/careers/mobile-app-development/cross-platform-mobile-development/mobile-state-and-navigation)**<br>/careers/mobile-app-development/cross-platform-mobile-development/mobile-state-and-navigation | Managing app state and screen navigation flows.<br>*Key Tracks: Module 1: Mobile State & Navigation, Module 2: Mobile State & Navigation, Module 3: Mobile State & Navigation* | 3 Tracks |
| 4 | **[Working with Device APIs](/careers/mobile-app-development/cross-platform-mobile-development/working-with-device-apis)**<br>/careers/mobile-app-development/cross-platform-mobile-development/working-with-device-apis | Camera, location, and notifications on mobile devices.<br>*Key Tracks: Module 1: Working with Device APIs, Module 2: Working with Device APIs, Module 3: Working with Device APIs* | 3 Tracks |
| 5 | **[App Store Deployment](/careers/mobile-app-development/cross-platform-mobile-development/app-store-deployment)**<br>/careers/mobile-app-development/cross-platform-mobile-development/app-store-deployment | Packaging and publishing apps to app stores.<br>*Key Tracks: Module 1: App Store Deployment, Module 2: App Store Deployment* | 2 Tracks |

---

### 30. Music & Audio Production
- **Career Route**: /careers/music-audio-production
- **Description**: Create, record, and produce music and audio content.

#### 🛤️ Path 1: Music Production Foundations
- **Path Route**: /careers/music-audio-production/music-production-foundations
- **Path Scope**: Core skills for producing music in a modern studio.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Music Theory Basics](/careers/music-audio-production/music-production-foundations/music-theory-basics)**<br>/careers/music-audio-production/music-production-foundations/music-theory-basics | Scales, chords, and rhythm fundamentals.<br>*Key Tracks: Module 2: Music Theory Basics, Module 1: Music Theory Basics, Module 3: Music Theory Basics* | 3 Tracks |
| 2 | **[DAW Fundamentals](/careers/music-audio-production/music-production-foundations/daw-fundamentals)**<br>/careers/music-audio-production/music-production-foundations/daw-fundamentals | Producing and arranging tracks in a digital audio workstation.<br>*Key Tracks: Module 1: DAW Fundamentals, Module 3: DAW Fundamentals, Module 4: DAW Fundamentals* | 4 Tracks |
| 3 | **[Recording & Mic Techniques](/careers/music-audio-production/music-production-foundations/recording-and-mic-techniques)**<br>/careers/music-audio-production/music-production-foundations/recording-and-mic-techniques | Capturing clean, usable audio.<br>*Key Tracks: Module 1: Recording & Mic Techniques, Module 2: Recording & Mic Techniques, Module 3: Recording & Mic Techniques* | 3 Tracks |
| 4 | **[Mixing Basics](/careers/music-audio-production/music-production-foundations/mixing-basics)**<br>/careers/music-audio-production/music-production-foundations/mixing-basics | Balancing levels, EQ, and effects into a finished mix.<br>*Key Tracks: Module 2: Mixing Basics, Module 1: Mixing Basics, Module 3: Mixing Basics* | 3 Tracks |

---

### 31. Non-Profit & Social Work
- **Career Route**: /careers/non-profit-social-work
- **Description**: Support communities and causes through mission-driven work.

#### 🛤️ Path 1: Non-Profit Program Management
- **Path Route**: /careers/non-profit-social-work/non-profit-program-management
- **Path Scope**: Plan and run programs that deliver real community impact.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Program Design & Planning](/careers/non-profit-social-work/non-profit-program-management/program-design-and-planning)**<br>/careers/non-profit-social-work/non-profit-program-management/program-design-and-planning | Structuring programs around clear outcomes.<br>*Key Tracks: Module 1: Program Design & Planning, Module 3: Program Design & Planning, Module 2: Program Design & Planning* | 3 Tracks |
| 2 | **[Grant Writing Basics](/careers/non-profit-social-work/non-profit-program-management/grant-writing-basics)**<br>/careers/non-profit-social-work/non-profit-program-management/grant-writing-basics | Writing proposals that secure funding.<br>*Key Tracks: Module 2: Grant Writing Basics, Module 3: Grant Writing Basics, Module 1: Grant Writing Basics* | 3 Tracks |
| 3 | **[Volunteer Coordination](/careers/non-profit-social-work/non-profit-program-management/volunteer-coordination)**<br>/careers/non-profit-social-work/non-profit-program-management/volunteer-coordination | Recruiting and managing volunteers effectively.<br>*Key Tracks: Module 2: Volunteer Coordination, Module 1: Volunteer Coordination* | 2 Tracks |
| 4 | **[Impact Measurement & Reporting](/careers/non-profit-social-work/non-profit-program-management/impact-measurement-and-reporting)**<br>/careers/non-profit-social-work/non-profit-program-management/impact-measurement-and-reporting | Demonstrating and reporting program outcomes.<br>*Key Tracks: Module 2: Impact Measurement & Reporting, Module 3: Impact Measurement & Reporting, Module 1: Impact Measurement & Reporting* | 3 Tracks |

#### 🛤️ Path 2: Social Work Foundations
- **Path Route**: /careers/non-profit-social-work/social-work-foundations
- **Path Scope**: Core skills for supporting individuals and families in need.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Case Management Basics](/careers/non-profit-social-work/social-work-foundations/case-management-basics)**<br>/careers/non-profit-social-work/social-work-foundations/case-management-basics | Coordinating support services for clients.<br>*Key Tracks: Module 2: Case Management Basics, Module 1: Case Management Basics, Module 3: Case Management Basics* | 3 Tracks |
| 2 | **[Crisis Intervention](/careers/non-profit-social-work/social-work-foundations/crisis-intervention)**<br>/careers/non-profit-social-work/social-work-foundations/crisis-intervention | Responding effectively to urgent client needs.<br>*Key Tracks: Module 3: Crisis Intervention, Module 2: Crisis Intervention, Module 1: Crisis Intervention* | 3 Tracks |
| 3 | **[Community Resource Navigation](/careers/non-profit-social-work/social-work-foundations/community-resource-navigation)**<br>/careers/non-profit-social-work/social-work-foundations/community-resource-navigation | Connecting clients to the right support services.<br>*Key Tracks: Module 3: Community Resource Navigation, Module 2: Community Resource Navigation, Module 1: Community Resource Navigation* | 3 Tracks |
| 4 | **[Social Work Ethics & Boundaries](/careers/non-profit-social-work/social-work-foundations/social-work-ethics-and-boundaries)**<br>/careers/non-profit-social-work/social-work-foundations/social-work-ethics-and-boundaries | Maintaining professional, ethical client relationships.<br>*Key Tracks: Module 3: Social Work Ethics & Boundaries, Module 2: Social Work Ethics & Boundaries, Module 1: Social Work Ethics & Boundaries* | 3 Tracks |

---

### 32. People Management & Leadership
- **Career Route**: /careers/people-management-and-leadership
- **Description**: Lead, coach, and get the best out of a team.

#### 🛤️ Path 1: People Management Foundations
- **Path Route**: /careers/people-management-and-leadership/people-management-foundations
- **Path Scope**: Core skills for managing people effectively for the first time.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Leading Teams](/careers/people-management-and-leadership/people-management-foundations/leading-teams)**<br>/careers/people-management-and-leadership/people-management-foundations/leading-teams | Setting direction and expectations for a team.<br>*Key Tracks: Module 1: Leading Teams, Module 2: Leading Teams, Module 3: Leading Teams* | 3 Tracks |
| 2 | **[Delegation & Feedback](/careers/people-management-and-leadership/people-management-foundations/delegation-and-feedback)**<br>/careers/people-management-and-leadership/people-management-foundations/delegation-and-feedback | Handing off work effectively and giving feedback that lands.<br>*Key Tracks: Module 1: Delegation & Feedback, Module 2: Delegation & Feedback, Module 3: Delegation & Feedback* | 3 Tracks |
| 3 | **[Performance Coaching](/careers/people-management-and-leadership/people-management-foundations/performance-coaching)**<br>/careers/people-management-and-leadership/people-management-foundations/performance-coaching | Helping team members grow and improve over time.<br>*Key Tracks: Module 2: Performance Coaching, Module 3: Performance Coaching, Module 1: Performance Coaching* | 3 Tracks |
| 4 | **[Organizational Communication](/careers/people-management-and-leadership/people-management-foundations/organizational-communication)**<br>/careers/people-management-and-leadership/people-management-foundations/organizational-communication | Communicating clearly up, down, and across an organization.<br>*Key Tracks: Module 3: Organizational Communication, Module 1: Organizational Communication, Module 2: Organizational Communication* | 3 Tracks |

---

### 33. Photography
- **Career Route**: /careers/photography
- **Description**: Capture and edit compelling images professionally.

#### 🛤️ Path 1: Photography Foundations
- **Path Route**: /careers/photography/photography-foundations
- **Path Scope**: Core technical and creative photography skills.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Camera & Exposure Fundamentals](/careers/photography/photography-foundations/camera-and-exposure-fundamentals)**<br>/careers/photography/photography-foundations/camera-and-exposure-fundamentals | Aperture, shutter speed, ISO, and manual control.<br>*Key Tracks: Module 3: Camera & Exposure Fundamentals, Module 2: Camera & Exposure Fundamentals, Module 1: Camera & Exposure Fundamentals* | 3 Tracks |
| 2 | **[Composition & Lighting](/careers/photography/photography-foundations/composition-and-lighting)**<br>/careers/photography/photography-foundations/composition-and-lighting | Framing shots and working with available or set lighting.<br>*Key Tracks: Module 1: Composition & Lighting, Module 2: Composition & Lighting, Module 3: Composition & Lighting* | 3 Tracks |
| 3 | **[Photo Editing](/careers/photography/photography-foundations/photo-editing)**<br>/careers/photography/photography-foundations/photo-editing | Post-processing in Lightroom or similar tools.<br>*Key Tracks: Module 2: Photo Editing, Module 1: Photo Editing, Module 3: Photo Editing* | 3 Tracks |
| 4 | **[Building a Photography Portfolio](/careers/photography/photography-foundations/building-a-photography-portfolio)**<br>/careers/photography/photography-foundations/building-a-photography-portfolio | Curating and presenting work professionally.<br>*Key Tracks: Module 1: Building a Photography Portfolio, Module 2: Building a Photography Portfolio* | 2 Tracks |

---

### 34. Product Management
- **Career Route**: /careers/product-management
- **Description**: Define what gets built and why, aligning teams around user and business value.

#### 🛤️ Path 1: Core Product Management
- **Path Route**: /careers/product-management/core-product-management
- **Path Scope**: The essential skills for owning a product roadmap.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Product Discovery](/careers/product-management/core-product-management/product-discovery)**<br>/careers/product-management/core-product-management/product-discovery | Identifying real problems worth solving.<br>*Key Tracks: Module 3: Product Discovery, Module 1: Product Discovery, Module 2: Product Discovery* | 3 Tracks |
| 2 | **[Roadmapping & Prioritization](/careers/product-management/core-product-management/roadmapping-and-prioritization)**<br>/careers/product-management/core-product-management/roadmapping-and-prioritization | Sequencing work using frameworks like RICE.<br>*Key Tracks: Module 2: Roadmapping & Prioritization, Module 1: Roadmapping & Prioritization, Module 3: Roadmapping & Prioritization* | 3 Tracks |
| 3 | **[Writing Requirements & User Stories](/careers/product-management/core-product-management/writing-requirements-and-user-stories)**<br>/careers/product-management/core-product-management/writing-requirements-and-user-stories | Translating ideas into buildable specs.<br>*Key Tracks: Module 1: Writing Requirements & User Stories, Module 2: Writing Requirements & User Stories, Module 3: Writing Requirements & User Stories* | 3 Tracks |
| 4 | **[Metrics & Product Analytics](/careers/product-management/core-product-management/metrics-and-product-analytics)**<br>/careers/product-management/core-product-management/metrics-and-product-analytics | Defining and tracking product success metrics.<br>*Key Tracks: Module 3: Metrics & Product Analytics, Module 2: Metrics & Product Analytics, Module 1: Metrics & Product Analytics* | 3 Tracks |
| 5 | **[Stakeholder Communication](/careers/product-management/core-product-management/stakeholder-communication)**<br>/careers/product-management/core-product-management/stakeholder-communication | Aligning engineering, design, and business.<br>*Key Tracks: Module 2: Stakeholder Communication, Module 1: Stakeholder Communication* | 2 Tracks |
| 6 | **[Go-to-Market Basics](/careers/product-management/core-product-management/go-to-market-basics)**<br>/careers/product-management/core-product-management/go-to-market-basics | Launching features and coordinating release plans.<br>*Key Tracks: Module 1: Go-to-Market Basics, Module 2: Go-to-Market Basics* | 2 Tracks |

---

### 35. Project Management
- **Career Route**: /careers/project-management
- **Description**: Plan, coordinate, and deliver projects on time and within scope.

#### 🛤️ Path 1: Project Management Foundations
- **Path Route**: /careers/project-management/project-management-foundations
- **Path Scope**: Core skills for running structured, on-track projects.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Project Planning & Scope Definition](/careers/project-management/project-management-foundations/project-planning-and-scope-definition)**<br>/careers/project-management/project-management-foundations/project-planning-and-scope-definition | Defining what a project will and won't deliver.<br>*Key Tracks: Module 1: Project Planning & Scope Definition, Module 2: Project Planning & Scope Definition, Module 3: Project Planning & Scope Definition* | 3 Tracks |
| 2 | **[Agile & Scrum Basics](/careers/project-management/project-management-foundations/agile-and-scrum-basics)**<br>/careers/project-management/project-management-foundations/agile-and-scrum-basics | Running iterative, adaptive project workflows.<br>*Key Tracks: Module 1: Agile & Scrum Basics, Module 2: Agile & Scrum Basics, Module 3: Agile & Scrum Basics* | 3 Tracks |
| 3 | **[Risk & Issue Management](/careers/project-management/project-management-foundations/risk-and-issue-management)**<br>/careers/project-management/project-management-foundations/risk-and-issue-management | Anticipating and handling problems before they derail a project.<br>*Key Tracks: Module 1: Risk & Issue Management, Module 2: Risk & Issue Management, Module 3: Risk & Issue Management* | 3 Tracks |
| 4 | **[Stakeholder Communication](/careers/project-management/project-management-foundations/stakeholder-communication)**<br>/careers/project-management/project-management-foundations/stakeholder-communication | Keeping the right people informed at the right time.<br>*Key Tracks: Module 1: Stakeholder Communication, Module 2: Stakeholder Communication* | 2 Tracks |
| 5 | **[Project Management Tools](/careers/project-management/project-management-foundations/project-management-tools)**<br>/careers/project-management/project-management-foundations/project-management-tools | Using tools like Jira, Asana, or Trello to track work.<br>*Key Tracks: Module 1: Project Management Tools, Module 2: Project Management Tools* | 2 Tracks |

---

### 36. Psychology & Human Understanding
- **Career Route**: /careers/psychology-human-understanding
- **Description**: Understand people — their behavior, emotions, and unspoken signals — for careers in counseling, HR, coaching, and beyond.

#### 🛤️ Path 1: Human Behavior Track
- **Path Route**: /careers/psychology-human-understanding/human-behavior-track
- **Path Scope**: Build a foundation in how and why people behave the way they do.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Human Understanding & Empathy](/careers/psychology-human-understanding/human-behavior-track/human-understanding-and-empathy)**<br>/careers/psychology-human-understanding/human-behavior-track/human-understanding-and-empathy | Recognizing and responding to others' emotional states.<br>*Key Tracks: Module 3: Human Understanding & Empathy, Module 1: Human Understanding & Empathy, Module 2: Human Understanding & Empathy* | 3 Tracks |
| 2 | **[Situation Understanding](/careers/psychology-human-understanding/human-behavior-track/situation-understanding)**<br>/careers/psychology-human-understanding/human-behavior-track/situation-understanding | Reading context and social dynamics accurately before acting.<br>*Key Tracks: Module 3: Situation Understanding, Module 2: Situation Understanding, Module 1: Situation Understanding* | 3 Tracks |
| 3 | **[Face Reading & Micro-expressions](/careers/psychology-human-understanding/human-behavior-track/face-reading-and-micro-expressions)**<br>/careers/psychology-human-understanding/human-behavior-track/face-reading-and-micro-expressions | Identifying brief, involuntary facial expressions and what they signal.<br>*Key Tracks: Module 3: Face Reading & Micro-expressions, Module 1: Face Reading & Micro-expressions, Module 2: Face Reading & Micro-expressions* | 3 Tracks |
| 4 | **[Body Language Basics](/careers/psychology-human-understanding/human-behavior-track/body-language-basics)**<br>/careers/psychology-human-understanding/human-behavior-track/body-language-basics | Non-verbal cues in posture, gesture, and tone.<br>*Key Tracks: Module 1: Body Language Basics, Module 2: Body Language Basics* | 2 Tracks |
| 5 | **[Cognitive Biases & Decision-Making](/careers/psychology-human-understanding/human-behavior-track/cognitive-biases-and-decision-making)**<br>/careers/psychology-human-understanding/human-behavior-track/cognitive-biases-and-decision-making | How people actually make decisions, and where it goes wrong.<br>*Key Tracks: Module 1: Cognitive Biases & Decision-Making, Module 2: Cognitive Biases & Decision-Making* | 2 Tracks |

#### 🛤️ Path 2: Counseling Foundations
- **Path Route**: /careers/psychology-human-understanding/counseling-foundations
- **Path Scope**: Core interpersonal skills used in counseling, coaching, and support roles.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Active Listening](/careers/psychology-human-understanding/counseling-foundations/active-listening)**<br>/careers/psychology-human-understanding/counseling-foundations/active-listening | Listening techniques that make people feel genuinely heard.<br>*Key Tracks: Module 2: Active Listening, Module 3: Active Listening, Module 1: Active Listening* | 3 Tracks |
| 2 | **[Basic Counseling Techniques](/careers/psychology-human-understanding/counseling-foundations/basic-counseling-techniques)**<br>/careers/psychology-human-understanding/counseling-foundations/basic-counseling-techniques | Foundational approaches used in supportive conversations.<br>*Key Tracks: Module 1: Basic Counseling Techniques, Module 2: Basic Counseling Techniques, Module 3: Basic Counseling Techniques* | 3 Tracks |
| 3 | **[Conflict Resolution](/careers/psychology-human-understanding/counseling-foundations/conflict-resolution)**<br>/careers/psychology-human-understanding/counseling-foundations/conflict-resolution | De-escalating and mediating interpersonal conflict.<br>*Key Tracks: Module 2: Conflict Resolution, Module 3: Conflict Resolution, Module 1: Conflict Resolution* | 3 Tracks |
| 4 | **[Ethics & Boundaries](/careers/psychology-human-understanding/counseling-foundations/ethics-and-boundaries)**<br>/careers/psychology-human-understanding/counseling-foundations/ethics-and-boundaries | Professional boundaries and ethical considerations in helping roles.<br>*Key Tracks: Module 3: Ethics & Boundaries, Module 1: Ethics & Boundaries, Module 2: Ethics & Boundaries* | 3 Tracks |

---

### 37. Public Relations & Communications
- **Career Route**: /careers/public-relations-communications
- **Description**: Shape and protect how organizations are perceived publicly.

#### 🛤️ Path 1: PR & Media Relations
- **Path Route**: /careers/public-relations-communications/pr-media-relations
- **Path Scope**: Build relationships with media and manage public messaging.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Press Release Writing](/careers/public-relations-communications/pr-media-relations/press-release-writing)**<br>/careers/public-relations-communications/pr-media-relations/press-release-writing | Writing announcements that earn media coverage.<br>*Key Tracks: Module 2: Press Release Writing, Module 1: Press Release Writing, Module 3: Press Release Writing* | 3 Tracks |
| 2 | **[Media Relations & Pitching](/careers/public-relations-communications/pr-media-relations/media-relations-and-pitching)**<br>/careers/public-relations-communications/pr-media-relations/media-relations-and-pitching | Building relationships with journalists and outlets.<br>*Key Tracks: Module 1: Media Relations & Pitching, Module 3: Media Relations & Pitching, Module 2: Media Relations & Pitching* | 3 Tracks |
| 3 | **[Crisis Communication](/careers/public-relations-communications/pr-media-relations/crisis-communication)**<br>/careers/public-relations-communications/pr-media-relations/crisis-communication | Managing messaging during reputational challenges.<br>*Key Tracks: Module 1: Crisis Communication, Module 2: Crisis Communication, Module 3: Crisis Communication* | 3 Tracks |
| 4 | **[Brand Messaging & Positioning](/careers/public-relations-communications/pr-media-relations/brand-messaging-and-positioning)**<br>/careers/public-relations-communications/pr-media-relations/brand-messaging-and-positioning | Crafting a consistent public narrative for a brand.<br>*Key Tracks: Module 2: Brand Messaging & Positioning, Module 3: Brand Messaging & Positioning, Module 1: Brand Messaging & Positioning* | 3 Tracks |

---

### 38. Public Safety & Emergency Services
- **Career Route**: /careers/public-safety-emergency-services
- **Description**: Protect and respond to communities in emergencies.

#### 🛤️ Path 1: Emergency Response Foundations
- **Path Route**: /careers/public-safety-emergency-services/emergency-response-foundations
- **Path Scope**: Core skills for first-response and emergency situations.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[First Aid & CPR](/careers/public-safety-emergency-services/emergency-response-foundations/first-aid-and-cpr)**<br>/careers/public-safety-emergency-services/emergency-response-foundations/first-aid-and-cpr | Life-saving basic emergency medical response.<br>*Key Tracks: Module 3: First Aid & CPR, Module 2: First Aid & CPR, Module 1: First Aid & CPR* | 3 Tracks |
| 2 | **[Emergency Scene Assessment](/careers/public-safety-emergency-services/emergency-response-foundations/emergency-scene-assessment)**<br>/careers/public-safety-emergency-services/emergency-response-foundations/emergency-scene-assessment | Quickly and safely evaluating an emergency situation.<br>*Key Tracks: Module 1: Emergency Scene Assessment, Module 3: Emergency Scene Assessment, Module 2: Emergency Scene Assessment* | 3 Tracks |
| 3 | **[Communication Under Pressure](/careers/public-safety-emergency-services/emergency-response-foundations/communication-under-pressure)**<br>/careers/public-safety-emergency-services/emergency-response-foundations/communication-under-pressure | Clear radio and verbal communication during emergencies.<br>*Key Tracks: Module 2: Communication Under Pressure, Module 3: Communication Under Pressure, Module 1: Communication Under Pressure* | 3 Tracks |
| 4 | **[Public Safety Regulations Basics](/careers/public-safety-emergency-services/emergency-response-foundations/public-safety-regulations-basics)**<br>/careers/public-safety-emergency-services/emergency-response-foundations/public-safety-regulations-basics | Legal and procedural fundamentals for responders.<br>*Key Tracks: Module 2: Public Safety Regulations Basics, Module 1: Public Safety Regulations Basics* | 2 Tracks |
| 5 | **[Disaster Preparedness](/careers/public-safety-emergency-services/emergency-response-foundations/disaster-preparedness)**<br>/careers/public-safety-emergency-services/emergency-response-foundations/disaster-preparedness | Planning for and mitigating large-scale emergencies.<br>*Key Tracks: Module 2: Disaster Preparedness, Module 1: Disaster Preparedness* | 2 Tracks |

---

### 39. Real Estate
- **Career Route**: /careers/real-estate
- **Description**: Help people buy, sell, lease, and invest in property.

#### 🛤️ Path 1: Real Estate Sales
- **Path Route**: /careers/real-estate/real-estate-sales
- **Path Scope**: Represent buyers and sellers through property transactions.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Real Estate Fundamentals & Law Basics](/careers/real-estate/real-estate-sales/real-estate-fundamentals-and-law-basics)**<br>/careers/real-estate/real-estate-sales/real-estate-fundamentals-and-law-basics | Core concepts and legal basics of property transactions.<br>*Key Tracks: Module 3: Real Estate Fundamentals & Law Basics, Module 2: Real Estate Fundamentals & Law Basics, Module 1: Real Estate Fundamentals & Law Basics* | 3 Tracks |
| 2 | **[Property Valuation Basics](/careers/real-estate/real-estate-sales/property-valuation-basics)**<br>/careers/real-estate/real-estate-sales/property-valuation-basics | Estimating a property's fair market value.<br>*Key Tracks: Module 2: Property Valuation Basics, Module 3: Property Valuation Basics, Module 1: Property Valuation Basics* | 3 Tracks |
| 3 | **[Client Prospecting & Relationship Building](/careers/real-estate/real-estate-sales/client-prospecting-and-relationship-building)**<br>/careers/real-estate/real-estate-sales/client-prospecting-and-relationship-building | Finding and nurturing buyer/seller relationships.<br>*Key Tracks: Module 1: Client Prospecting & Relationship Building, Module 2: Client Prospecting & Relationship Building, Module 3: Client Prospecting & Relationship Building* | 3 Tracks |
| 4 | **[Negotiation & Closing](/careers/real-estate/real-estate-sales/negotiation-and-closing)**<br>/careers/real-estate/real-estate-sales/negotiation-and-closing | Navigating offers through to a completed sale.<br>*Key Tracks: Module 1: Negotiation & Closing, Module 2: Negotiation & Closing, Module 3: Negotiation & Closing* | 3 Tracks |

#### 🛤️ Path 2: Property Management
- **Path Route**: /careers/real-estate/property-management
- **Path Scope**: Manage rental properties on behalf of owners.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Tenant Screening & Leasing](/careers/real-estate/property-management/tenant-screening-and-leasing)**<br>/careers/real-estate/property-management/tenant-screening-and-leasing | Finding and vetting reliable tenants.<br>*Key Tracks: Module 3: Tenant Screening & Leasing, Module 2: Tenant Screening & Leasing, Module 1: Tenant Screening & Leasing* | 3 Tracks |
| 2 | **[Property Maintenance Coordination](/careers/real-estate/property-management/property-maintenance-coordination)**<br>/careers/real-estate/property-management/property-maintenance-coordination | Keeping properties in good condition efficiently.<br>*Key Tracks: Module 1: Property Maintenance Coordination, Module 2: Property Maintenance Coordination* | 2 Tracks |
| 3 | **[Rent Collection & Budgeting](/careers/real-estate/property-management/rent-collection-and-budgeting)**<br>/careers/real-estate/property-management/rent-collection-and-budgeting | Managing income and expenses for a property.<br>*Key Tracks: Module 2: Rent Collection & Budgeting, Module 1: Rent Collection & Budgeting* | 2 Tracks |
| 4 | **[Landlord-Tenant Law Basics](/careers/real-estate/property-management/landlord-tenant-law-basics)**<br>/careers/real-estate/property-management/landlord-tenant-law-basics | Staying compliant with rental regulations.<br>*Key Tracks: Module 2: Landlord-Tenant Law Basics, Module 1: Landlord-Tenant Law Basics, Module 3: Landlord-Tenant Law Basics* | 3 Tracks |

---

### 40. Retail Management
- **Career Route**: /careers/retail-management
- **Description**: Run stores and retail teams that deliver great customer experiences.

#### 🛤️ Path 1: Retail Operations
- **Path Route**: /careers/retail-management/retail-operations
- **Path Scope**: Manage the day-to-day operations of a retail store.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Store Operations Fundamentals](/careers/retail-management/retail-operations/store-operations-fundamentals)**<br>/careers/retail-management/retail-operations/store-operations-fundamentals | Opening/closing procedures, cash handling, and workflows.<br>*Key Tracks: Module 1: Store Operations Fundamentals, Module 3: Store Operations Fundamentals, Module 2: Store Operations Fundamentals* | 3 Tracks |
| 2 | **[Inventory & Merchandising](/careers/retail-management/retail-operations/inventory-and-merchandising)**<br>/careers/retail-management/retail-operations/inventory-and-merchandising | Stocking, displaying, and tracking products effectively.<br>*Key Tracks: Module 3: Inventory & Merchandising, Module 1: Inventory & Merchandising, Module 2: Inventory & Merchandising* | 3 Tracks |
| 3 | **[Customer Service in Retail](/careers/retail-management/retail-operations/customer-service-in-retail)**<br>/careers/retail-management/retail-operations/customer-service-in-retail | Creating positive in-store shopping experiences.<br>*Key Tracks: Module 1: Customer Service in Retail, Module 2: Customer Service in Retail* | 2 Tracks |
| 4 | **[Retail Team Leadership](/careers/retail-management/retail-operations/retail-team-leadership)**<br>/careers/retail-management/retail-operations/retail-team-leadership | Scheduling, training, and motivating store staff.<br>*Key Tracks: Module 2: Retail Team Leadership, Module 1: Retail Team Leadership, Module 3: Retail Team Leadership* | 3 Tracks |

#### 🛤️ Path 2: Retail Sales & Merchandising Strategy
- **Path Route**: /careers/retail-management/retail-sales-merchandising-strategy
- **Path Scope**: Drive sales through effective merchandising and customer engagement.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Visual Merchandising](/careers/retail-management/retail-sales-merchandising-strategy/visual-merchandising)**<br>/careers/retail-management/retail-sales-merchandising-strategy/visual-merchandising | Designing displays that attract and convert shoppers.<br>*Key Tracks: Module 2: Visual Merchandising, Module 1: Visual Merchandising, Module 3: Visual Merchandising* | 3 Tracks |
| 2 | **[Sales Techniques for Retail](/careers/retail-management/retail-sales-merchandising-strategy/sales-techniques-for-retail)**<br>/careers/retail-management/retail-sales-merchandising-strategy/sales-techniques-for-retail | Upselling and closing sales on the floor.<br>*Key Tracks: Module 3: Sales Techniques for Retail, Module 2: Sales Techniques for Retail, Module 1: Sales Techniques for Retail* | 3 Tracks |
| 3 | **[Retail Analytics Basics](/careers/retail-management/retail-sales-merchandising-strategy/retail-analytics-basics)**<br>/careers/retail-management/retail-sales-merchandising-strategy/retail-analytics-basics | Reading sales data to guide store decisions.<br>*Key Tracks: Module 1: Retail Analytics Basics, Module 2: Retail Analytics Basics* | 2 Tracks |
| 4 | **[Loss Prevention Basics](/careers/retail-management/retail-sales-merchandising-strategy/loss-prevention-basics)**<br>/careers/retail-management/retail-sales-merchandising-strategy/loss-prevention-basics | Reducing shrinkage and theft in retail environments.<br>*Key Tracks: Module 2: Loss Prevention Basics, Module 1: Loss Prevention Basics* | 2 Tracks |

---

### 41. Sales & Business Development
- **Career Route**: /careers/sales-business-development
- **Description**: Win and grow customer relationships that drive revenue.

#### 🛤️ Path 1: B2B Sales
- **Path Route**: /careers/sales-business-development/b2b-sales
- **Path Scope**: Sell complex products and services to businesses.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Prospecting & Lead Generation](/careers/sales-business-development/b2b-sales/prospecting-and-lead-generation)**<br>/careers/sales-business-development/b2b-sales/prospecting-and-lead-generation | Finding and qualifying potential customers.<br>*Key Tracks: Module 3: Prospecting & Lead Generation, Module 2: Prospecting & Lead Generation, Module 1: Prospecting & Lead Generation* | 3 Tracks |
| 2 | **[Consultative Selling](/careers/sales-business-development/b2b-sales/consultative-selling)**<br>/careers/sales-business-development/b2b-sales/consultative-selling | Discovering needs and positioning solutions.<br>*Key Tracks: Module 3: Consultative Selling, Module 2: Consultative Selling, Module 1: Consultative Selling* | 3 Tracks |
| 3 | **[Objection Handling & Negotiation](/careers/sales-business-development/b2b-sales/objection-handling-and-negotiation)**<br>/careers/sales-business-development/b2b-sales/objection-handling-and-negotiation | Navigating pushback and closing deals fairly.<br>*Key Tracks: Module 2: Objection Handling & Negotiation, Module 3: Objection Handling & Negotiation, Module 1: Objection Handling & Negotiation* | 3 Tracks |
| 4 | **[CRM & Pipeline Management](/careers/sales-business-development/b2b-sales/crm-and-pipeline-management)**<br>/careers/sales-business-development/b2b-sales/crm-and-pipeline-management | Tracking deals and forecasting accurately.<br>*Key Tracks: Module 1: CRM & Pipeline Management, Module 2: CRM & Pipeline Management* | 2 Tracks |
| 5 | **[Sales Presentations](/careers/sales-business-development/b2b-sales/sales-presentations)**<br>/careers/sales-business-development/b2b-sales/sales-presentations | Pitching persuasively to decision-makers.<br>*Key Tracks: Module 2: Sales Presentations, Module 1: Sales Presentations* | 2 Tracks |

#### 🛤️ Path 2: Account Management
- **Path Route**: /careers/sales-business-development/account-management
- **Path Scope**: Retain and grow existing customer relationships.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Customer Onboarding](/careers/sales-business-development/account-management/customer-onboarding)**<br>/careers/sales-business-development/account-management/customer-onboarding | Setting new accounts up for long-term success.<br>*Key Tracks: Module 2: Customer Onboarding, Module 1: Customer Onboarding* | 2 Tracks |
| 2 | **[Relationship Management](/careers/sales-business-development/account-management/relationship-management)**<br>/careers/sales-business-development/account-management/relationship-management | Building trust and communicating proactively.<br>*Key Tracks: Module 3: Relationship Management, Module 2: Relationship Management, Module 1: Relationship Management* | 3 Tracks |
| 3 | **[Upselling & Renewals](/careers/sales-business-development/account-management/upselling-and-renewals)**<br>/careers/sales-business-development/account-management/upselling-and-renewals | Growing account value while protecting retention.<br>*Key Tracks: Module 3: Upselling & Renewals, Module 1: Upselling & Renewals, Module 2: Upselling & Renewals* | 3 Tracks |
| 4 | **[Account Health Metrics](/careers/sales-business-development/account-management/account-health-metrics)**<br>/careers/sales-business-development/account-management/account-health-metrics | Tracking usage and risk signals to act early.<br>*Key Tracks: Module 2: Account Health Metrics, Module 3: Account Health Metrics, Module 1: Account Health Metrics* | 3 Tracks |

---

### 42. Skilled Trades
- **Career Route**: /careers/skilled-trades
- **Description**: Hands-on technical trades that keep the physical world running.

#### 🛤️ Path 1: Residential Electrical Basics
- **Path Route**: /careers/skilled-trades/residential-electrical-basics
- **Path Scope**: Foundational knowledge for residential electrical work.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Electrical Safety](/careers/skilled-trades/residential-electrical-basics/electrical-safety)**<br>/careers/skilled-trades/residential-electrical-basics/electrical-safety | Working safely around live circuits and equipment.<br>*Key Tracks: Module 1: Electrical Safety, Module 2: Electrical Safety, Module 3: Electrical Safety* | 3 Tracks |
| 2 | **[Circuit Fundamentals](/careers/skilled-trades/residential-electrical-basics/circuit-fundamentals)**<br>/careers/skilled-trades/residential-electrical-basics/circuit-fundamentals | Understanding voltage, current, and basic circuit design.<br>*Key Tracks: Module 2: Circuit Fundamentals, Module 3: Circuit Fundamentals, Module 1: Circuit Fundamentals* | 3 Tracks |
| 3 | **[Wiring & Installation Basics](/careers/skilled-trades/residential-electrical-basics/wiring-and-installation-basics)**<br>/careers/skilled-trades/residential-electrical-basics/wiring-and-installation-basics | Common residential wiring tasks and standards.<br>*Key Tracks: Module 3: Wiring & Installation Basics, Module 4: Wiring & Installation Basics, Module 2: Wiring & Installation Basics* | 4 Tracks |
| 4 | **[Reading Electrical Codes](/careers/skilled-trades/residential-electrical-basics/reading-electrical-codes)**<br>/careers/skilled-trades/residential-electrical-basics/reading-electrical-codes | Interpreting and applying local electrical codes.<br>*Key Tracks: Module 3: Reading Electrical Codes, Module 2: Reading Electrical Codes, Module 1: Reading Electrical Codes* | 3 Tracks |

#### 🛤️ Path 2: Plumbing Fundamentals
- **Path Route**: /careers/skilled-trades/plumbing-fundamentals
- **Path Scope**: Core skills for residential plumbing work.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Plumbing Safety & Tools](/careers/skilled-trades/plumbing-fundamentals/plumbing-safety-and-tools)**<br>/careers/skilled-trades/plumbing-fundamentals/plumbing-safety-and-tools | Safe use of common plumbing tools and equipment.<br>*Key Tracks: Module 3: Plumbing Safety & Tools, Module 2: Plumbing Safety & Tools, Module 1: Plumbing Safety & Tools* | 3 Tracks |
| 2 | **[Pipe Systems & Fittings](/careers/skilled-trades/plumbing-fundamentals/pipe-systems-and-fittings)**<br>/careers/skilled-trades/plumbing-fundamentals/pipe-systems-and-fittings | Understanding supply and drain systems.<br>*Key Tracks: Module 3: Pipe Systems & Fittings, Module 1: Pipe Systems & Fittings, Module 2: Pipe Systems & Fittings* | 3 Tracks |
| 3 | **[Fixture Installation & Repair](/careers/skilled-trades/plumbing-fundamentals/fixture-installation-and-repair)**<br>/careers/skilled-trades/plumbing-fundamentals/fixture-installation-and-repair | Installing and fixing sinks, toilets, and faucets.<br>*Key Tracks: Module 1: Fixture Installation & Repair, Module 2: Fixture Installation & Repair, Module 3: Fixture Installation & Repair* | 4 Tracks |
| 4 | **[Leak Diagnosis & Troubleshooting](/careers/skilled-trades/plumbing-fundamentals/leak-diagnosis-and-troubleshooting)**<br>/careers/skilled-trades/plumbing-fundamentals/leak-diagnosis-and-troubleshooting | Finding and resolving common plumbing issues.<br>*Key Tracks: Module 3: Leak Diagnosis & Troubleshooting, Module 2: Leak Diagnosis & Troubleshooting, Module 1: Leak Diagnosis & Troubleshooting* | 3 Tracks |

---

### 43. Software Engineering
- **Career Route**: /careers/software-engineering
- **Description**: Design, build, and maintain software systems — from user interfaces to the infrastructure that runs them.

#### 🛤️ Path 1: Full Stack Web Developer
- **Path Route**: /careers/software-engineering/full-stack-web-developer
- **Path Scope**: Learn HTML, CSS, JavaScript, React, Next.js, and backend databases.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[React & Next.js Fundamentals](/careers/software-engineering/full-stack-web-developer/react-nextjs-fundamentals)**<br>/careers/software-engineering/full-stack-web-developer/react-nextjs-fundamentals | Build interactive user interfaces with components, props, state, and server components.<br>*Key Tracks: Module 1: React Component Architecture* | 1 Tracks |

#### 🛤️ Path 2: Frontend Development
- **Path Route**: /careers/software-engineering/frontend-development
- **Path Scope**: Build the interfaces users interact with directly, in the browser.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[HTML & CSS Fundamentals](/careers/software-engineering/frontend-development/html-and-css-fundamentals)**<br>/careers/software-engineering/frontend-development/html-and-css-fundamentals | Structure and style web pages from scratch.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 2 | **[JavaScript Essentials](/careers/software-engineering/frontend-development/javascript-essentials)**<br>/careers/software-engineering/frontend-development/javascript-essentials | Core language features, DOM manipulation, async programming.<br>*Key Tracks: Module 1, Module 2, Module 3* | 8 Tracks |
| 3 | **[React](/careers/software-engineering/frontend-development/react)**<br>/careers/software-engineering/frontend-development/react | Component-based UI development with hooks and state.<br>*Key Tracks: Module 1, Module 2, Module 3* | 10 Tracks |
| 4 | **[Responsive & Accessible Design](/careers/software-engineering/frontend-development/responsive-and-accessible-design)**<br>/careers/software-engineering/frontend-development/responsive-and-accessible-design | Layouts that work across devices and are usable by everyone.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 5 | **[Frontend Performance & Tooling](/careers/software-engineering/frontend-development/frontend-performance-and-tooling)**<br>/careers/software-engineering/frontend-development/frontend-performance-and-tooling | Bundlers, lazy loading, Lighthouse audits, build pipelines.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 6 | **[Frontend Testing](/careers/software-engineering/frontend-development/frontend-testing)**<br>/careers/software-engineering/frontend-development/frontend-testing | Unit and component testing with Jest/React Testing Library.<br>*Key Tracks: Module 1, Module 2, Module 2: Frontend Testing* | 4 Tracks |

#### 🛤️ Path 3: Backend Development
- **Path Route**: /careers/software-engineering/backend-development
- **Path Scope**: Build the servers, APIs, and data layers that power applications.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Node.js & Express](/careers/software-engineering/backend-development/node-js-and-express)**<br>/careers/software-engineering/backend-development/node-js-and-express | Server-side JavaScript and building HTTP APIs.<br>*Key Tracks: Module 1, Module 2, Module 3* | 8 Tracks |
| 2 | **[Relational Databases & SQL](/careers/software-engineering/backend-development/relational-databases-and-sql)**<br>/careers/software-engineering/backend-development/relational-databases-and-sql | Schema design, queries, joins, indexing.<br>*Key Tracks: Module 1, Module 2, Module 3* | 8 Tracks |
| 3 | **[REST API Design](/careers/software-engineering/backend-development/rest-api-design)**<br>/careers/software-engineering/backend-development/rest-api-design | Resource modeling, status codes, versioning, documentation.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 4 | **[Authentication & Authorization](/careers/software-engineering/backend-development/authentication-and-authorization)**<br>/careers/software-engineering/backend-development/authentication-and-authorization | Sessions, JWTs, OAuth, role-based access control.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 5 | **[Backend Testing](/careers/software-engineering/backend-development/backend-testing)**<br>/careers/software-engineering/backend-development/backend-testing | Unit, integration, and API contract testing.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 6 | **[Caching & Queues](/careers/software-engineering/backend-development/caching-and-queues)**<br>/careers/software-engineering/backend-development/caching-and-queues | Redis, background jobs, and message queues for scale.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |

#### 🛤️ Path 4: DevOps
- **Path Route**: /careers/software-engineering/devops
- **Path Scope**: Automate, deploy, and keep systems running reliably.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Linux & Command Line](/careers/software-engineering/devops/linux-and-command-line)**<br>/careers/software-engineering/devops/linux-and-command-line | Filesystem, permissions, shell scripting basics.<br>*Key Tracks: Module 1, Module 2, Module 3* | 6 Tracks |
| 2 | **[Git & Version Control](/careers/software-engineering/devops/git-and-version-control)**<br>/careers/software-engineering/devops/git-and-version-control | Branching, merging, pull requests, collaboration workflows.<br>*Key Tracks: Module 1, Module 2, Module 1: Git & Version Control* | 4 Tracks |
| 3 | **[Docker & Containers](/careers/software-engineering/devops/docker-and-containers)**<br>/careers/software-engineering/devops/docker-and-containers | Containerizing applications and managing images.<br>*Key Tracks: Module 1, Module 2, Module 4: Docker & Containers* | 6 Tracks |
| 4 | **[CI/CD Pipelines](/careers/software-engineering/devops/ci-and-cd-pipelines)**<br>/careers/software-engineering/devops/ci-and-cd-pipelines | Automated build, test, and deployment pipelines.<br>*Key Tracks: Module 2: CI/CD Pipelines, Module 1: CI/CD Pipelines, Module 3: CI/CD Pipelines* | 4 Tracks |
| 5 | **[Cloud Fundamentals](/careers/software-engineering/devops/cloud-fundamentals)**<br>/careers/software-engineering/devops/cloud-fundamentals | Core services on AWS/Azure/GCP — compute, storage, networking.<br>*Key Tracks: Module 4: Cloud Fundamentals, Module 3: Cloud Fundamentals, Module 2: Cloud Fundamentals* | 4 Tracks |
| 6 | **[Monitoring & Incident Response](/careers/software-engineering/devops/monitoring-and-incident-response)**<br>/careers/software-engineering/devops/monitoring-and-incident-response | Logging, alerting, and on-call basics.<br>*Key Tracks: Module 1: Monitoring & Incident Response, Module 2: Monitoring & Incident Response* | 2 Tracks |

#### 🛤️ Path 5: Full Stack Development
- **Path Route**: /careers/software-engineering/full-stack-development
- **Path Scope**: Combine frontend and backend skills to ship complete applications end to end.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[System Design Basics](/careers/software-engineering/full-stack-development/system-design-basics)**<br>/careers/software-engineering/full-stack-development/system-design-basics | Trade-offs in architecture, scaling, and data flow.<br>*Key Tracks: Module 2: System Design Basics, Module 3: System Design Basics, Module 4: System Design Basics* | 4 Tracks |
| 2 | **[Connecting Frontend to Backend](/careers/software-engineering/full-stack-development/connecting-frontend-to-backend)**<br>/careers/software-engineering/full-stack-development/connecting-frontend-to-backend | API integration, state management, error handling across the stack.<br>*Key Tracks: Module 1: Connecting Frontend to Backend, Module 2: Connecting Frontend to Backend, Module 3: Connecting Frontend to Backend* | 3 Tracks |
| 3 | **[Deployment & Hosting](/careers/software-engineering/full-stack-development/deployment-and-hosting)**<br>/careers/software-engineering/full-stack-development/deployment-and-hosting | Shipping a full application to production.<br>*Key Tracks: Module 2: Deployment & Hosting, Module 3: Deployment & Hosting, Module 1: Deployment & Hosting* | 3 Tracks |
| 4 | **[Capstone Project](/careers/software-engineering/full-stack-development/capstone-project)**<br>/careers/software-engineering/full-stack-development/capstone-project | Build and deploy a complete application applying all prior skills.<br>*Key Tracks: Module 3: Capstone Project, Module 1: Capstone Project, Module 2: Capstone Project* | 3 Tracks |

---

### 44. Software Quality Assurance
- **Career Route**: /careers/software-quality-assurance
- **Description**: Make sure software works the way it's supposed to before it reaches users.

#### 🛤️ Path 1: QA & Software Testing Foundations
- **Path Route**: /careers/software-quality-assurance/qa-and-software-testing-foundations
- **Path Scope**: Core skills for finding and preventing software defects.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Manual Testing Fundamentals](/careers/software-quality-assurance/qa-and-software-testing-foundations/manual-testing-fundamentals)**<br>/careers/software-quality-assurance/qa-and-software-testing-foundations/manual-testing-fundamentals | Designing and executing test cases by hand.<br>*Key Tracks: Module 1: Manual Testing Fundamentals, Module 2: Manual Testing Fundamentals, Module 3: Manual Testing Fundamentals* | 3 Tracks |
| 2 | **[Test Case Design](/careers/software-quality-assurance/qa-and-software-testing-foundations/test-case-design)**<br>/careers/software-quality-assurance/qa-and-software-testing-foundations/test-case-design | Writing test cases that actually catch real bugs.<br>*Key Tracks: Module 1: Test Case Design, Module 2: Test Case Design, Module 3: Test Case Design* | 3 Tracks |
| 3 | **[Automated Testing Basics](/careers/software-quality-assurance/qa-and-software-testing-foundations/automated-testing-basics)**<br>/careers/software-quality-assurance/qa-and-software-testing-foundations/automated-testing-basics | Writing scripts that test software automatically.<br>*Key Tracks: Module 1: Automated Testing Basics, Module 2: Automated Testing Basics, Module 3: Automated Testing Basics* | 3 Tracks |
| 4 | **[Bug Tracking & Reporting](/careers/software-quality-assurance/qa-and-software-testing-foundations/bug-tracking-and-reporting)**<br>/careers/software-quality-assurance/qa-and-software-testing-foundations/bug-tracking-and-reporting | Documenting defects clearly enough for developers to fix them.<br>*Key Tracks: Module 1: Bug Tracking & Reporting, Module 2: Bug Tracking & Reporting* | 2 Tracks |

---

### 45. Supply Chain & Logistics
- **Career Route**: /careers/supply-chain-logistics
- **Description**: Move goods efficiently from source to customer.

#### 🛤️ Path 1: Logistics Operations
- **Path Route**: /careers/supply-chain-logistics/logistics-operations
- **Path Scope**: Coordinate the movement and storage of goods.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Inventory Management](/careers/supply-chain-logistics/logistics-operations/inventory-management)**<br>/careers/supply-chain-logistics/logistics-operations/inventory-management | Tracking stock levels and avoiding shortages or excess.<br>*Key Tracks: Module 2: Inventory Management, Module 3: Inventory Management, Module 1: Inventory Management* | 3 Tracks |
| 2 | **[Warehouse Operations](/careers/supply-chain-logistics/logistics-operations/warehouse-operations)**<br>/careers/supply-chain-logistics/logistics-operations/warehouse-operations | Efficient receiving, storage, and fulfillment processes.<br>*Key Tracks: Module 1: Warehouse Operations, Module 3: Warehouse Operations, Module 2: Warehouse Operations* | 3 Tracks |
| 3 | **[Transportation & Freight Basics](/careers/supply-chain-logistics/logistics-operations/transportation-and-freight-basics)**<br>/careers/supply-chain-logistics/logistics-operations/transportation-and-freight-basics | Choosing and coordinating shipping methods.<br>*Key Tracks: Module 2: Transportation & Freight Basics, Module 3: Transportation & Freight Basics, Module 1: Transportation & Freight Basics* | 3 Tracks |
| 4 | **[Logistics Software & Tracking](/careers/supply-chain-logistics/logistics-operations/logistics-software-and-tracking)**<br>/careers/supply-chain-logistics/logistics-operations/logistics-software-and-tracking | Using systems to monitor shipments and inventory.<br>*Key Tracks: Module 3: Logistics Software & Tracking, Module 1: Logistics Software & Tracking, Module 2: Logistics Software & Tracking* | 3 Tracks |

#### 🛤️ Path 2: Supply Chain Planning
- **Path Route**: /careers/supply-chain-logistics/supply-chain-planning
- **Path Scope**: Forecast demand and plan the end-to-end supply chain.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Demand Forecasting](/careers/supply-chain-logistics/supply-chain-planning/demand-forecasting)**<br>/careers/supply-chain-logistics/supply-chain-planning/demand-forecasting | Predicting future demand from historical data.<br>*Key Tracks: Module 1: Demand Forecasting, Module 3: Demand Forecasting, Module 2: Demand Forecasting* | 3 Tracks |
| 2 | **[Procurement Basics](/careers/supply-chain-logistics/supply-chain-planning/procurement-basics)**<br>/careers/supply-chain-logistics/supply-chain-planning/procurement-basics | Sourcing suppliers and managing purchasing.<br>*Key Tracks: Module 1: Procurement Basics, Module 2: Procurement Basics, Module 3: Procurement Basics* | 3 Tracks |
| 3 | **[Supplier Relationship Management](/careers/supply-chain-logistics/supply-chain-planning/supplier-relationship-management)**<br>/careers/supply-chain-logistics/supply-chain-planning/supplier-relationship-management | Building reliable, cost-effective supplier partnerships.<br>*Key Tracks: Module 2: Supplier Relationship Management, Module 3: Supplier Relationship Management, Module 1: Supplier Relationship Management* | 3 Tracks |
| 4 | **[Supply Chain Risk Management](/careers/supply-chain-logistics/supply-chain-planning/supply-chain-risk-management)**<br>/careers/supply-chain-logistics/supply-chain-planning/supply-chain-risk-management | Identifying and mitigating disruption risks.<br>*Key Tracks: Module 2: Supply Chain Risk Management, Module 3: Supply Chain Risk Management, Module 1: Supply Chain Risk Management* | 3 Tracks |

---

### 46. Teaching & Education
- **Career Route**: /careers/teaching-education
- **Description**: Design learning experiences and help others grow.

#### 🛤️ Path 1: Classroom Teaching Foundations
- **Path Route**: /careers/teaching-education/classroom-teaching-foundations
- **Path Scope**: Core skills for planning and running effective lessons.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Lesson Planning](/careers/teaching-education/classroom-teaching-foundations/lesson-planning)**<br>/careers/teaching-education/classroom-teaching-foundations/lesson-planning | Structuring lessons around clear learning objectives.<br>*Key Tracks: Module 2: Lesson Planning, Module 3: Lesson Planning, Module 1: Lesson Planning* | 3 Tracks |
| 2 | **[Classroom Management](/careers/teaching-education/classroom-teaching-foundations/classroom-management)**<br>/careers/teaching-education/classroom-teaching-foundations/classroom-management | Creating a productive, respectful learning environment.<br>*Key Tracks: Module 3: Classroom Management, Module 1: Classroom Management, Module 2: Classroom Management* | 3 Tracks |
| 3 | **[Differentiated Instruction](/careers/teaching-education/classroom-teaching-foundations/differentiated-instruction)**<br>/careers/teaching-education/classroom-teaching-foundations/differentiated-instruction | Adapting teaching to different learner needs.<br>*Key Tracks: Module 1: Differentiated Instruction, Module 2: Differentiated Instruction, Module 3: Differentiated Instruction* | 3 Tracks |
| 4 | **[Assessment & Feedback](/careers/teaching-education/classroom-teaching-foundations/assessment-and-feedback)**<br>/careers/teaching-education/classroom-teaching-foundations/assessment-and-feedback | Measuring learning and giving useful feedback.<br>*Key Tracks: Module 2: Assessment & Feedback, Module 1: Assessment & Feedback* | 2 Tracks |
| 5 | **[Educational Technology](/careers/teaching-education/classroom-teaching-foundations/educational-technology)**<br>/careers/teaching-education/classroom-teaching-foundations/educational-technology | Using digital tools to support teaching.<br>*Key Tracks: Module 1: Educational Technology, Module 2: Educational Technology* | 2 Tracks |

#### 🛤️ Path 2: Instructional Design
- **Path Route**: /careers/teaching-education/instructional-design
- **Path Scope**: Design structured learning content and courses.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Learning Objectives & Curriculum Design](/careers/teaching-education/instructional-design/learning-objectives-and-curriculum-design)**<br>/careers/teaching-education/instructional-design/learning-objectives-and-curriculum-design | Structuring what learners should know and do.<br>*Key Tracks: Module 2: Learning Objectives & Curriculum Design, Module 3: Learning Objectives & Curriculum Design, Module 1: Learning Objectives & Curriculum Design* | 3 Tracks |
| 2 | **[Adult Learning Principles](/careers/teaching-education/instructional-design/adult-learning-principles)**<br>/careers/teaching-education/instructional-design/adult-learning-principles | How adults learn differently than children.<br>*Key Tracks: Module 2: Adult Learning Principles, Module 3: Adult Learning Principles, Module 1: Adult Learning Principles* | 3 Tracks |
| 3 | **[Course Authoring Tools](/careers/teaching-education/instructional-design/course-authoring-tools)**<br>/careers/teaching-education/instructional-design/course-authoring-tools | Building interactive courses with common e-learning tools.<br>*Key Tracks: Module 3: Course Authoring Tools, Module 1: Course Authoring Tools, Module 2: Course Authoring Tools* | 3 Tracks |
| 4 | **[Learning Evaluation](/careers/teaching-education/instructional-design/learning-evaluation)**<br>/careers/teaching-education/instructional-design/learning-evaluation | Measuring whether training actually worked.<br>*Key Tracks: Module 2: Learning Evaluation, Module 3: Learning Evaluation, Module 1: Learning Evaluation* | 3 Tracks |

---

### 47. Technical Writing
- **Career Route**: /careers/technical-writing
- **Description**: Turn complex, technical information into clear documentation people can use.

#### 🛤️ Path 1: Technical Writing Foundations
- **Path Route**: /careers/technical-writing/technical-writing-foundations
- **Path Scope**: Core skills for writing documentation that people actually understand.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Documentation Fundamentals](/careers/technical-writing/technical-writing-foundations/documentation-fundamentals)**<br>/careers/technical-writing/technical-writing-foundations/documentation-fundamentals | Structuring docs so readers find what they need fast.<br>*Key Tracks: Module 1: Documentation Fundamentals, Module 2: Documentation Fundamentals, Module 3: Documentation Fundamentals* | 3 Tracks |
| 2 | **[API & Developer Documentation](/careers/technical-writing/technical-writing-foundations/api-and-developer-documentation)**<br>/careers/technical-writing/technical-writing-foundations/api-and-developer-documentation | Writing docs that help developers integrate correctly.<br>*Key Tracks: Module 1: API & Developer Documentation, Module 2: API & Developer Documentation, Module 3: API & Developer Documentation* | 3 Tracks |
| 3 | **[Style Guides & Editing](/careers/technical-writing/technical-writing-foundations/style-guides-and-editing)**<br>/careers/technical-writing/technical-writing-foundations/style-guides-and-editing | Keeping writing consistent, clear, and free of jargon overload.<br>*Key Tracks: Module 1: Style Guides & Editing, Module 2: Style Guides & Editing, Module 3: Style Guides & Editing* | 3 Tracks |
| 4 | **[Tools for Technical Writers](/careers/technical-writing/technical-writing-foundations/tools-for-technical-writers)**<br>/careers/technical-writing/technical-writing-foundations/tools-for-technical-writers | Working in docs-as-code and publishing toolchains.<br>*Key Tracks: Module 1: Tools for Technical Writers, Module 2: Tools for Technical Writers* | 2 Tracks |

---

### 48. Telecommunications
- **Career Route**: /careers/telecommunications
- **Description**: Build and maintain the networks that connect people and devices.

#### 🛤️ Path 1: Telecom Network Technician
- **Path Route**: /careers/telecommunications/telecom-network-technician
- **Path Scope**: Install and maintain telecommunications infrastructure.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Telecom Fundamentals](/careers/telecommunications/telecom-network-technician/telecom-fundamentals)**<br>/careers/telecommunications/telecom-network-technician/telecom-fundamentals | How voice, data, and signal networks operate.<br>*Key Tracks: Module 2: Telecom Fundamentals, Module 3: Telecom Fundamentals, Module 1: Telecom Fundamentals* | 3 Tracks |
| 2 | **[Cabling & Installation](/careers/telecommunications/telecom-network-technician/cabling-and-installation)**<br>/careers/telecommunications/telecom-network-technician/cabling-and-installation | Installing and terminating network cabling correctly.<br>*Key Tracks: Module 2: Cabling & Installation, Module 3: Cabling & Installation, Module 1: Cabling & Installation* | 3 Tracks |
| 3 | **[Network Troubleshooting](/careers/telecommunications/telecom-network-technician/network-troubleshooting)**<br>/careers/telecommunications/telecom-network-technician/network-troubleshooting | Diagnosing and resolving connectivity issues.<br>*Key Tracks: Module 2: Network Troubleshooting, Module 1: Network Troubleshooting, Module 3: Network Troubleshooting* | 3 Tracks |
| 4 | **[Wireless & Mobile Network Basics](/careers/telecommunications/telecom-network-technician/wireless-and-mobile-network-basics)**<br>/careers/telecommunications/telecom-network-technician/wireless-and-mobile-network-basics | Fundamentals of cellular and wireless infrastructure.<br>*Key Tracks: Module 1: Wireless & Mobile Network Basics, Module 2: Wireless & Mobile Network Basics, Module 3: Wireless & Mobile Network Basics* | 3 Tracks |

---

### 49. Translation & Language Services
- **Career Route**: /careers/translation-language-services
- **Description**: Bridge communication across languages professionally.

#### 🛤️ Path 1: Professional Translation
- **Path Route**: /careers/translation-language-services/professional-translation
- **Path Scope**: Translate written content accurately and fluently.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Translation Fundamentals](/careers/translation-language-services/professional-translation/translation-fundamentals)**<br>/careers/translation-language-services/professional-translation/translation-fundamentals | Accuracy, tone, and fidelity across languages.<br>*Key Tracks: Module 3: Translation Fundamentals, Module 2: Translation Fundamentals, Module 1: Translation Fundamentals* | 3 Tracks |
| 2 | **[CAT Tools](/careers/translation-language-services/professional-translation/cat-tools)**<br>/careers/translation-language-services/professional-translation/cat-tools | Using computer-assisted translation software.<br>*Key Tracks: Module 3: CAT Tools, Module 2: CAT Tools, Module 1: CAT Tools* | 3 Tracks |
| 3 | **[Specialized Terminology](/careers/translation-language-services/professional-translation/specialized-terminology)**<br>/careers/translation-language-services/professional-translation/specialized-terminology | Building glossaries for legal, medical, or technical domains.<br>*Key Tracks: Module 2: Specialized Terminology, Module 3: Specialized Terminology, Module 1: Specialized Terminology* | 3 Tracks |
| 4 | **[Quality Review & Proofreading](/careers/translation-language-services/professional-translation/quality-review-and-proofreading)**<br>/careers/translation-language-services/professional-translation/quality-review-and-proofreading | Catching errors before delivery.<br>*Key Tracks: Module 2: Quality Review & Proofreading, Module 1: Quality Review & Proofreading* | 2 Tracks |

---

### 50. Urban Planning
- **Career Route**: /careers/urban-planning
- **Description**: Shape how cities and communities grow and function.

#### 🛤️ Path 1: Urban & Community Planning Foundations
- **Path Route**: /careers/urban-planning/urban-community-planning-foundations
- **Path Scope**: Core skills for planning land use and community development.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Land Use & Zoning Fundamentals](/careers/urban-planning/urban-community-planning-foundations/land-use-and-zoning-fundamentals)**<br>/careers/urban-planning/urban-community-planning-foundations/land-use-and-zoning-fundamentals | How land is designated and regulated for use.<br>*Key Tracks: Module 2: Land Use & Zoning Fundamentals, Module 3: Land Use & Zoning Fundamentals, Module 1: Land Use & Zoning Fundamentals* | 3 Tracks |
| 2 | **[Urban Planning GIS Basics](/careers/urban-planning/urban-community-planning-foundations/urban-planning-gis-basics)**<br>/careers/urban-planning/urban-community-planning-foundations/urban-planning-gis-basics | Mapping and spatial analysis for planning decisions.<br>*Key Tracks: Module 3: Urban Planning GIS Basics, Module 1: Urban Planning GIS Basics, Module 2: Urban Planning GIS Basics* | 3 Tracks |
| 3 | **[Community Engagement](/careers/urban-planning/urban-community-planning-foundations/community-engagement)**<br>/careers/urban-planning/urban-community-planning-foundations/community-engagement | Gathering and incorporating public input in planning.<br>*Key Tracks: Module 3: Community Engagement, Module 2: Community Engagement, Module 1: Community Engagement* | 3 Tracks |
| 4 | **[Sustainable Urban Design Basics](/careers/urban-planning/urban-community-planning-foundations/sustainable-urban-design-basics)**<br>/careers/urban-planning/urban-community-planning-foundations/sustainable-urban-design-basics | Designing communities with sustainability in mind.<br>*Key Tracks: Module 2: Sustainable Urban Design Basics, Module 1: Sustainable Urban Design Basics* | 2 Tracks |

---

### 51. UX/UI Design
- **Career Route**: /careers/ux-ui-design
- **Description**: Design digital products that are usable, useful, and delightful.

#### 🛤️ Path 1: UX Research & Strategy
- **Path Route**: /careers/ux-ui-design/ux-research-strategy
- **Path Scope**: Understand users and shape product direction around real needs.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[User Research Methods](/careers/ux-ui-design/ux-research-strategy/user-research-methods)**<br>/careers/ux-ui-design/ux-research-strategy/user-research-methods | Interviews, surveys, and usability testing.<br>*Key Tracks: Module 3: User Research Methods, Module 2: User Research Methods, Module 1: User Research Methods* | 3 Tracks |
| 2 | **[Personas & Journey Mapping](/careers/ux-ui-design/ux-research-strategy/personas-and-journey-mapping)**<br>/careers/ux-ui-design/ux-research-strategy/personas-and-journey-mapping | Translating research into actionable user models.<br>*Key Tracks: Module 3: Personas & Journey Mapping, Module 1: Personas & Journey Mapping, Module 2: Personas & Journey Mapping* | 3 Tracks |
| 3 | **[Information Architecture](/careers/ux-ui-design/ux-research-strategy/information-architecture)**<br>/careers/ux-ui-design/ux-research-strategy/information-architecture | Structuring content and navigation logically.<br>*Key Tracks: Module 2: Information Architecture, Module 1: Information Architecture, Module 3: Information Architecture* | 3 Tracks |
| 4 | **[Usability Testing & Iteration](/careers/ux-ui-design/ux-research-strategy/usability-testing-and-iteration)**<br>/careers/ux-ui-design/ux-research-strategy/usability-testing-and-iteration | Running tests and turning findings into design changes.<br>*Key Tracks: Module 3: Usability Testing & Iteration, Module 2: Usability Testing & Iteration, Module 1: Usability Testing & Iteration* | 3 Tracks |
| 5 | **[UX Writing](/careers/ux-ui-design/ux-research-strategy/ux-writing)**<br>/careers/ux-ui-design/ux-research-strategy/ux-writing | Clear, concise microcopy for interfaces.<br>*Key Tracks: Module 2: UX Writing, Module 1: UX Writing* | 2 Tracks |

#### 🛤️ Path 2: UI Design & Prototyping
- **Path Route**: /careers/ux-ui-design/ui-design-prototyping
- **Path Scope**: Craft visual interfaces and interactive prototypes.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Visual Design Fundamentals](/careers/ux-ui-design/ui-design-prototyping/visual-design-fundamentals)**<br>/careers/ux-ui-design/ui-design-prototyping/visual-design-fundamentals | Layout, color, typography, and hierarchy.<br>*Key Tracks: Module 1: Visual Design Fundamentals, Module 2: Visual Design Fundamentals, Module 3: Visual Design Fundamentals* | 3 Tracks |
| 2 | **[Design Systems](/careers/ux-ui-design/ui-design-prototyping/design-systems)**<br>/careers/ux-ui-design/ui-design-prototyping/design-systems | Building and maintaining reusable component libraries.<br>*Key Tracks: Module 3: Design Systems, Module 1: Design Systems, Module 2: Design Systems* | 3 Tracks |
| 3 | **[Figma & Prototyping Tools](/careers/ux-ui-design/ui-design-prototyping/figma-and-prototyping-tools)**<br>/careers/ux-ui-design/ui-design-prototyping/figma-and-prototyping-tools | High-fidelity mockups and interactive prototypes.<br>*Key Tracks: Module 2: Figma & Prototyping Tools, Module 4: Figma & Prototyping Tools, Module 3: Figma & Prototyping Tools* | 4 Tracks |
| 4 | **[Accessibility in Design](/careers/ux-ui-design/ui-design-prototyping/accessibility-in-design)**<br>/careers/ux-ui-design/ui-design-prototyping/accessibility-in-design | Designing inclusively for all users.<br>*Key Tracks: Module 2: Accessibility in Design, Module 1: Accessibility in Design* | 2 Tracks |
| 5 | **[Handoff to Development](/careers/ux-ui-design/ui-design-prototyping/handoff-to-development)**<br>/careers/ux-ui-design/ui-design-prototyping/handoff-to-development | Specs, redlines, and collaborating with engineers.<br>*Key Tracks: Module 1: Handoff to Development, Module 2: Handoff to Development* | 2 Tracks |

---

### 52. Veterinary & Animal Care
- **Career Route**: /careers/veterinary-animal-care
- **Description**: Support the health and wellbeing of animals.

#### 🛤️ Path 1: Veterinary Assistant Foundations
- **Path Route**: /careers/veterinary-animal-care/veterinary-assistant-foundations
- **Path Scope**: Core skills for supporting veterinary clinical work.

| # | Skill & Route | End Learning & Competency Focus | Tracks |
|---|---|---|---|
| 1 | **[Animal Handling & Restraint](/careers/veterinary-animal-care/veterinary-assistant-foundations/animal-handling-and-restraint)**<br>/careers/veterinary-animal-care/veterinary-assistant-foundations/animal-handling-and-restraint | Safely handling animals during exams and procedures.<br>*Key Tracks: Module 3: Animal Handling & Restraint, Module 2: Animal Handling & Restraint, Module 1: Animal Handling & Restraint* | 3 Tracks |
| 2 | **[Basic Veterinary Terminology](/careers/veterinary-animal-care/veterinary-assistant-foundations/basic-veterinary-terminology)**<br>/careers/veterinary-animal-care/veterinary-assistant-foundations/basic-veterinary-terminology | Common clinical language used in animal care.<br>*Key Tracks: Module 2: Basic Veterinary Terminology, Module 1: Basic Veterinary Terminology* | 2 Tracks |
| 3 | **[Clinic Hygiene & Safety](/careers/veterinary-animal-care/veterinary-assistant-foundations/clinic-hygiene-and-safety)**<br>/careers/veterinary-animal-care/veterinary-assistant-foundations/clinic-hygiene-and-safety | Infection control and safe clinic practices.<br>*Key Tracks: Module 3: Clinic Hygiene & Safety, Module 2: Clinic Hygiene & Safety, Module 1: Clinic Hygiene & Safety* | 3 Tracks |
| 4 | **[Client Communication in Vet Care](/careers/veterinary-animal-care/veterinary-assistant-foundations/client-communication-in-vet-care)**<br>/careers/veterinary-animal-care/veterinary-assistant-foundations/client-communication-in-vet-care | Communicating clearly and compassionately with pet owners.<br>*Key Tracks: Module 1: Client Communication in Vet Care, Module 3: Client Communication in Vet Care, Module 2: Client Communication in Vet Care* | 3 Tracks |

---

