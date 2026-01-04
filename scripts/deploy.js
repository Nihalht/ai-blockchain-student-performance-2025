const hre = require("hardhat");

async function main() {
    const StudentPerformance = await hre.ethers.getContractFactory("StudentPerformance");
    const studentPerformance = await StudentPerformance.deploy();

    await studentPerformance.waitForDeployment();

    console.log(
        `StudentPerformance deployed to ${await studentPerformance.getAddress()}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
