pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract identity {

  struct UserStruct {
    string userEmail;
    uint userAge;
    uint index;
    string Password;
    uint fingerprint;
    string Name;

  }
  
  mapping(address => UserStruct) private userStructs;
  address[] private userIndex;

  event LogNewUser   (string Name,address indexed userAddress, uint index, string  userEmail, uint userAge, string Password, uint fingerprint);
  event LogUpdateUser(address indexed userAddress, uint index, string userEmail, uint userAge);
  
  function isUser(address userAddress)
    public 
    view
    returns(bool isIndeed) 
  {
    if(userIndex.length == 0) return false;
    return (userIndex[userStructs[userAddress].index] == userAddress);
  }

  function insertUser( string memory Name,
    address userAddress, 
    string memory userEmail, 
    uint    userAge, string memory Password, uint fingerprint) 
    public
    returns(uint index)
  {
    require(!isUser(userAddress)); 
    userStructs[userAddress].userEmail = userEmail;
    userStructs[userAddress].userAge   = userAge;
    userStructs[userAddress].index     = userIndex.push(userAddress)-1;
    userStructs[userAddress].Name = Name;
    userStructs[userAddress].Password = Password;
    userStructs[userAddress].fingerprint = fingerprint;


    emit LogNewUser(
        Name,
        userAddress, 
        userStructs[userAddress].index, 
        userEmail, 
        userAge,
        Password,
        fingerprint);
    return userIndex.length-1;
  }
  
  function getUser(address userAddress)
    public 
    view
    returns(string memory userEmail, uint userAge, uint index, string memory Name, string memory Password, uint fingerprint)
  {
    require(isUser(userAddress)); 
    return(
      userStructs[userAddress].userEmail, 
      userStructs[userAddress].userAge, 
      userStructs[userAddress].index,
      userStructs[userAddress].Name,
      userStructs[userAddress].Password,
      userStructs[userAddress].fingerprint);
  } 
  
  function updateUserEmail(address userAddress, string memory userEmail) 
    public
    returns(bool success) 
  {
    require(!isUser(userAddress)); 
    userStructs[userAddress].userEmail = userEmail;
    emit LogUpdateUser(
      userAddress, 
      userStructs[userAddress].index,
      userEmail, 
      userStructs[userAddress].userAge);
    return true;
  }
  
  function updateUserAge(address userAddress, uint userAge) 
    public
    returns(bool success) 
  {
    require(!isUser(userAddress)); 
    userStructs[userAddress].userAge = userAge;
    emit LogUpdateUser(
      userAddress, 
      userStructs[userAddress].index,
      userStructs[userAddress].userEmail, 
      userAge);
    return true;
  }

  function getUserCount() 
    public
    view
    returns(uint count)
  {
    return userIndex.length;
  }

  function getUserAtIndex(uint index)
    public
    view
    returns(address userAddress)
  {
    return userIndex[index];
  }

 

}

