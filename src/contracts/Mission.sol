pragma solidity ^0.5.0;

contract Mission {
    string public name;
    string public featured_image;
    string public mission_address;
    string public contact;
    string public location;
    string public email;
    uint public centerCount = 0;

    mapping(uint256 => Center) public centers;

    struct Center {
        uint256 id;
        string center_name;
        string featured_image;      
        string mission_address;      
        string contact;
        string location;  
        string email; 
        address payable owner;       
    }

    event CenterCreated(
        uint256 id,
        string center_name,
        string featured_image,     
        string mission_address,      
        string contact,
        string location, 
        string email,
        address payable owner
    );   

    constructor() public {
        name = "Mission";
    }

    function createCenter(
        string memory _center_name,
        string memory _featured_image,     
        string memory _mission_address,      
        string memory _contact,
        string memory _location, 
        string memory _email
    ) public {
        // Require a valid name
        require(bytes(_center_name).length > 0);
        // Require a valid image
        require(bytes(_featured_image).length > 0);
        // Require a valid address
        require(bytes(_mission_address).length > 0);
        // Require a valid contact
        require(bytes(_contact).length > 0);
        // Require a valid location
        require(bytes(_location).length > 0);
        // Require a valid email
        require(bytes(_email).length > 0);
      
        // Increment center count
        centerCount++;
        // Create the center
        centers[centerCount] = Center(centerCount, _center_name, _featured_image, _mission_address, _contact,_location, _email, msg.sender);
        // Trigger an event
        emit CenterCreated(
            centerCount,
            _center_name,
            _featured_image,
            _mission_address,
            _contact,
            _location,
            _email,
            msg.sender
            
        );
    }    
}
