# HRVD GARAGE — Car Trading Platform

A full-stack car trading platform for independent dealers to list inventory, track sales, and manage customer relationships.

**Live demo:** [sacredgarage.vercel.app](https://sacredgarage.vercel.app/)

## Problem

Independent car dealers need an affordable way to list inventory, track sales, and manage customer relationships without expensive dealership management software.

## What it does

- Vehicle listings with images, specs, and pricing
- Sales tracking dashboard with transaction history
- Customer relationship management tools
- Real-time inventory updates

## Tech Stack

React · Node.js · PostgreSQL · Tailwind CSS

## Key Decisions

Used PostgreSQL for relational inventory data across dealers, vehicles, and transactions instead of a document DB — the relational model better represents the actual business logic of car trading, where every vehicle is linked to a dealer, sale, and customer history.

## Setup

```bash
git clone https://github.com/sainttlaurel/HRVD-GARAGE.git
cd HRVD-GARAGE
npm install
cp .env.example .env.local
# configure your database connection
npm run dev
```

## Screenshots

<img width="1904" height="940" alt="9" src="https://github.com/user-attachments/assets/6f8f7dd8-f2da-459d-89c9-7eec0b90cf60" />
<img width="1899" height="934" alt="8" src="https://github.com/user-attachments/assets/a52d2330-1dee-4666-9a96-47ef8b9cd894" />
<img width="1898" height="933" alt="7" src="https://github.com/user-attachments/assets/43e055c5-72ee-46c3-8611-2ad373bc3d2f" />
<img width="1909" height="938" alt="6" src="https://github.com/user-attachments/assets/c8aba6ba-e080-403c-8b3c-0571d4f02263" />
<img width="1901" height="933" alt="5" src="https://github.com/user-attachments/assets/d2496b7d-9046-4609-a925-61842f2b04a3" />
<img width="1899" height="932" alt="4" src="https://github.com/user-attachments/assets/26e94c62-039a-4c81-9e11-a601c9097ef7" />
<img width="1899" height="935" alt="3" src="https://github.com/user-attachments/assets/6932c945-2bdc-476f-b80d-0bda28608f0d" />
<img width="1905" height="933" alt="2" src="https://github.com/user-attachments/assets/bddd20f7-f744-470e-901a-d96ef71fd1f6" />
<img width="1903" height="932" alt="1" src="https://github.com/user-attachments/assets/9a859629-05e9-4a02-8c4c-bc40adba055d" />
