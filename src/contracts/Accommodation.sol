pragma solidity ^0.5.0;

contract Accommodation {
    uint center_id;
    string public name;
    string public image;
    uint public accitemCount = 0;
    mapping(uint => Accitem) public accitems;

    struct Accitem {
        uint id;
        uint center_id;
        string name;
        string image;
        uint price;
        uint room_num;
        uint bed_num;
        string description;
        address payable owner;
        bool isBooked;
    }

    event AccitemCreated(
        uint id,
        uint center_id,
        string name,
        string image,
        uint price,
        uint room_num,
        uint bed_num,
        string description,
        address payable owner,
        bool isBooked
    );

    constructor() public {
         
    }

    function createAccitem(
        uint _center_id,
        string memory _name,
        string memory _image,
        uint _price,
        uint _room_num,
        uint _bed_num,
        string memory _description  
    ) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        //Validate Image
        require(bytes(_image).length > 0);
        
        // Require a valid description
        require(bytes(_description).length > 0);
        // Require a valid number of rooms
        require(_room_num > 0);
        // Require a valid number of beds
        require(_bed_num > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        accitemCount++;
        // Create the product
        accitems[accitemCount] = Accitem(
            accitemCount,
            _center_id,
            _name,
            _image,
            _price,
            _room_num,
            _bed_num,
            _description,
            msg.sender,
            false
        );
        // Trigger an event
        emit AccitemCreated(
            accitemCount,
            _center_id,
            _name,
            _image,
            _price,
            _room_num,
            _bed_num,
            _description,
            msg.sender,
            false
        );
    }
}
