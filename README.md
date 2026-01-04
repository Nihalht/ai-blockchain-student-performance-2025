# EduChain AI: Blockchain & AI Powered Student Performance Analysis 2025

EduChain AI is a next-generation academic analytics platform that combines the immutability of Blockchain with the predictive power of Artificial Intelligence. It provides teachers with a tamper-proof way to record student grades and uses machine learning to forecast student success.

## 🚀 Key Features

- **🛡️ Blockchain Immutability**: All academic records are stored on a local Ethereum blockchain (Hardhat), ensuring they can never be altered or forged.
- **🧠 AI Prediction Engine**: A Python-based Random Forest model predicts student grades (A-F) and identifies system risk levels.
- **📊 Real-time Dashboard**: Beautiful data visualizations using Recharts to track GPA evolution and attendance trends.
- **👩‍🏫 Teacher Portal**: A dedicated secure portal for educators to "deploy" student performance data directly to the decentralized network.
- **✨ Premium UI/UX**: A state-of-the-art glassmorphism design with micro-animations and dynamic student "Personas" (Elite Visionary, Consistent Achiever, etc.).

---

## 📸 Project Showcase

### 1. Intelligence Dashboard
![Dashboard](/Users/nihalht/.gemini/antigravity/brain/0dc5955f-2a70-4976-8556-48990ff5b91f/dashboard_final_1767525250966.png)
*Real-time statistics and infrastructure health monitoring.*

### 2. AI Performance Forecast
![AI Prediction](/Users/nihalht/.gemini/antigravity/brain/0dc5955f-2a70-4976-8556-48990ff5b91f/performance_forecast_dashboard_1767523844758.png)
*Student Persona mapping based on predicted academic outcomes.*

### 3. Teacher Portal (Blockchain Transaction)
![Teacher Portal](/Users/nihalht/.gemini/antigravity/brain/0dc5955f-2a70-4976-8556-48990ff5b91f/teacher_portal_action_1767525498874.png)
*Securely deploying academic records to the decentralized protocol.*

---

## 🛠️ Technical Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Ethers.js
- **Blockchain**: Solidity, Hardhat, Ethereum (Local Node)
- **AI/ML**: Python (Scikit-learn), FastAPI, Uvicorn
- **Storage**: Decentalized On-chain Storage (Solidity Mappings)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Metamask Browser Extension

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/USER_NAME/ai-blockchain-student-performance-2025.git
   cd ai-blockchain-student-performance-2025
   ```

2. **Blockchain Setup**
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Backend (AI Service) Setup**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn backend.main:app --reload
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for the future of decentralized education.*
