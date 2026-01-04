// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StudentPerformance {
    address public owner;

    struct Record {
        string semester;
        string subject;
        uint256 score;
        uint256 timestamp;
        string remarks;
    }

    struct Student {
        uint256 id;
        string name;
        bool exists;
    }

    uint256[] public allStudentIds;

    mapping(uint256 => Student) public students;
    mapping(uint256 => Record[]) public studentRecords;

    event StudentAdded(uint256 indexed id, string name);
    event RecordAdded(uint256 indexed id, string semester, string subject, uint256 score);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addStudent(uint256 _id, string memory _name) public onlyOwner {
        require(!students[_id].exists, "Student already exists");
        students[_id] = Student(_id, _name, true);
        allStudentIds.push(_id);
        emit StudentAdded(_id, _name);
    }

    function addRecord(uint256 _id, string memory _semester, string memory _subject, uint256 _score, string memory _remarks) public onlyOwner {
        if (!students[_id].exists) {
            addStudent(_id, string(abi.encodePacked("Student #", uint2str(_id))));
        }
        Record memory newRecord = Record(_semester, _subject, _score, block.timestamp, _remarks);
        studentRecords[_id].push(newRecord);
        emit RecordAdded(_id, _semester, _subject, _score);
    }

    function getAllStudentIds() public view returns (uint256[] memory) {
        return allStudentIds;
    }

    // Helper for generating names if not exists
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) { len++; j /= 10; }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function getStudent(uint256 _id) public view returns (Student memory) {
        return students[_id];
    }

    function getRecords(uint256 _id) public view returns (Record[] memory) {
        return studentRecords[_id];
    }
}
