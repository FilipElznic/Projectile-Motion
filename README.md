# 🦅 Projectile Motion & Angry Birds Clone

> **Hack Club Accelerate (Weeks 5 & 6)**  
> A physics-based playground that evolved from simple projectile motion formulas into a full-featured Angry Birds clone.

![Project Banner](https://img.shields.io/badge/Physics-Engine-blue?style=for-the-badge) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 🌐 Live Demo

Check out the live version here:  
👉 **[projectile-motion-pied.vercel.app](https://projectile-motion-pied.vercel.app)**

---

## 📖 What is this project?

This project was built for the **Hack Club Accelerate Hackathon**. The theme was **Projectile Motion**, so I decided to build a custom 2D physics engine from scratch to visualize the mathematics behind flight, gravity, and collisions.

What started as a simple educational tool to demonstrate $v_y = v_{y0} - g \cdot t$ evolved into a game where you can launch birds at structures!

### Key Features

- **Custom Physics Engine**: Built from the ground up using vector mathematics. Handles gravity, velocity, drag, and elastic collisions.
- **Interactive Simulations**:
  - **Gravity Demo**: Visualize how acceleration affects vertical velocity.
  - **Drag & Shoot**: Master the art of parabolic trajectories.
- **Angry Birds Game Mode**: A fully playable level with destructible blocks and pigs.
- **Custom Bird Creator**: Design your own projectile! Adjust mass, radius, color, and launch power to see how physics properties affect the flight path.
- **Educational Math**: Real-time formulas and explanations shown alongside the simulations.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Math Rendering**: KaTeX

## 🚀 How to Install & Run

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/FilipElznic/Projectile-Motion.git
    cd Projectile-Motion
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    ```

4.  **Open in your browser**
    Visit `http://localhost:5173` to see the app running!

## 🧪 Physics Concepts Used

The engine implements the following core concepts:

- **Velocity Decomposition**: Breaking vectors into $x$ and $y$ components.
- **Gravity**: Constant downward acceleration ($9.8 m/s^2$).
- **Restitution**: Energy loss during collisions (bounciness).
- **Air Resistance**: Drag force applied opposite to velocity.

---

_Created by Filip Elznic for Hack Club Accelerate._
