pragma solidity ^0.5.0;


contract Book {  
     // uint public itemId;
    uint public bookingCount = 0;

    mapping(uint => Booking) public bookings;
    
    struct Booking {
        uint id;
        string fromDate;
        string toDate;
        uint itemId;
        uint amountPaid;
        address payable guest;
    }

    event BookingCreated(
        uint id,
        string fromDate,
        string toDate,
        uint itemId,
        uint amountPaid,
        address payable guest
    );   

    constructor() public {
       
    }

    function createBooking(  
        string memory _fromDate,
        string memory _toDate,
        uint  _itemId,
        uint _amountPaid ) 
        
        public {       
        require(_amountPaid > 0);
        // Increment product count
        bookingCount ++;
        // Create the product
        bookings[bookingCount] = Booking(bookingCount, _fromDate, _toDate, _itemId, _amountPaid,msg.sender);
        // Trigger an event
        emit BookingCreated(bookingCount, _fromDate, _toDate, _itemId, _amountPaid,msg.sender);


        // Fetch the Accomodation
       /* Accitem memory _accitem = accitems[_itemId];
        _accitem.isBooked = true;*/
    }    
}
