import { ethers } from 'ethers';
import StudentPerformance from '../artifacts/contracts/StudentPerformance.sol/StudentPerformance.json';

// Updated after re-deployment
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install MetaMask.");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
};

export const getContract = async (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, StudentPerformance.abi, signerOrProvider);
};

export const fetchAllRecords = async (signerOrProvider) => {
    const contract = await getContract(signerOrProvider);
    const ids = await contract.getAllStudentIds();

    const allData = [];
    for (const id of ids) {
        const student = await contract.getStudent(id);
        const records = await contract.getRecords(id);

        records.forEach(r => {
            allData.push({
                studentId: id.toString(),
                studentName: student.name,
                semester: r.semester,
                subject: r.subject,
                score: r.score.toString(),
                timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString(),
                remarks: r.remarks
            });
        });
    }
    return allData.sort((a, b) => b.timestamp - a.timestamp);
};

export const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};
