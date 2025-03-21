const contractAddress = "0x5c3c0aeEC3598d3869335Be92AA90E724cbAA23c";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "issueDate",
				"type": "string"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "issueDate",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "issueDate",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isIssued",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "student",
				"type": "address"
			}
		],
		"name": "verifyCertificate",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

let web3;
let contract;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Connected to MetaMask:", accounts[0]);
    } else {
        alert("Please install MetaMask!");
    }
}

async function issueCertificate() {
    const student = document.getElementById("studentAddress").value;
    const name = document.getElementById("studentName").value;
    const course = document.getElementById("courseName").value;
    const date = document.getElementById("issueDate").value;

    if (!student || !name || !course || !date) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.issueCertificate(student, name, course, date)
            .send({ from: accounts[0] });

        document.getElementById("issueStatus").innerText = "Certificate Issued Successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("issueStatus").innerText = "Error Issuing Certificate!";
    }
}

async function verifyCertificate() {
    const student = document.getElementById("verifyAddress").value;
    if (!student) {
        alert("Please enter a student address!");
        return;
    }

    try {
        const result = await contract.methods.verifyCertificate(student).call();
        if (result[3]) {
            document.getElementById("verifyResult").innerHTML = `
                <strong>Student:</strong> ${result[0]}<br>
                <strong>Course:</strong> ${result[1]}<br>
                <strong>Issued on:</strong> ${result[2]}<br>
                <span style="color: green;">✅ Verified</span>
            `;
        } else {
            document.getElementById("verifyResult").innerHTML = "<span style='color: red;'>❌ No Certificate Found</span>";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("verifyResult").innerText = "Verification Failed!";
    }
}

window.onload = init;
