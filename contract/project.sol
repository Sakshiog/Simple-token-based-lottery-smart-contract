// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseCertificate {
    struct Certificate {
        string studentName;
        string courseName;
        string issueDate;
        bool isIssued;
    }
    
    address public admin;
    mapping(address => Certificate) public certificates;
    
    event CertificateIssued(address indexed student, string studentName, string courseName, string issueDate);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue certificates");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function issueCertificate(address student, string memory studentName, string memory courseName, string memory issueDate) public onlyAdmin {
        require(!certificates[student].isIssued, "Certificate already issued");
        
        certificates[student] = Certificate(studentName, courseName, issueDate, true);
        emit CertificateIssued(student, studentName, courseName, issueDate);
    }
    
    function verifyCertificate(address student) public view returns (string memory, string memory, string memory, bool) {
        Certificate memory cert = certificates[student];
        return (cert.studentName, cert.courseName, cert.issueDate, cert.isIssued);
}
}
