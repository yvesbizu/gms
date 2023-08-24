pragma solidity ^0.5.0;

contract Conference {
    uint center_id;
    string public name;
    uint public hallCount = 0;
    mapping(uint => Hall) public halls;

    struct Hall {
        uint id;
        uint center_id;
        string name;
        uint price;
        uint capacity; 
        string description;
        address payable owner;
        bool isBooked;
    }

    event HallCreated(
        uint id,
        uint center_id,
        string name,
        uint price,
        uint capacity,   
        string description,
        address payable owner,
        bool isBooked
    );

    constructor() public {}

    function createHall(
        uint _center_id,
        string memory _name,
        uint _price,
        uint _capacity,
        string memory _description  
    ) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid name
        require(bytes(_description).length > 0);
        // Require a valid capacity
        require(_capacity > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        hallCount++;
        // Create the product
        halls[hallCount] = Hall(
            hallCount,
            _center_id,
            _name,
            _price,
            _capacity,
            _description,
            msg.sender,
            false
        );
        // Trigger an event
        emit HallCreated(
            hallCount,
            _center_id,
            _name,
            _price,
            _capacity,
            _description,
            msg.sender,
            false
        );
    }
}
