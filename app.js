App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

 initWeb3: async function() {
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },


 initContract: function() {
    $.getJSON("identity.json", function(identity) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.identity = TruffleContract(identity);
      // Connect provider to interact with contract
      App.contracts.identity.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

    // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.identity.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.LogNewUser({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.identity.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.getUserCount();
    }).then(function(userCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 0; i < userCount; i++) {
        electionInstance.getUserAtIndex(i).then(function(address) {
          electionInstance.getUser(address).then (function(user) {

            var email = user[0];
            console.log(typeof(email));   
            var age = user[1];
            var id = user[2];
            var name= user[3];
            var password=user[4];
            var fingerprint=user[5];
            console.log(address);
            // Render candidate Result
            var candidateTemplate = "<tr><th>" + name + "</th><td>" + email + "</td><td>" + age + "</td></td>"+ password + "</td><td>"+ fingerprint+  "</td><tr>"
            candidatesResults.append(candidateTemplate);

           

            });
          
        });
      }
      //return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },


  validate: function()                                    
    { 
        console.log("validate");
        var name = document.forms["RegForm"]["Name"];               
        var address = document.forms["RegForm"]["Address"];    
        var email = document.forms["RegForm"]["Email"];  
        var password =  document.forms["RegForm"]["Password"];  
        var mobile = document.forms["RegForm"]["Mobile"];  
        var credential1 = document.forms["RegForm"]["Credential1"];  
        var credential2 = document.forms["RegForm"]["Credential2"];  
        var fingerprint = document.forms["RegForm"]["Fingerprint"];  
        if (name.value == "")                                  
        { 
            window.alert("Please enter your name."); 
            name.focus(); 
            return false; 
        } 
           
        if (email.value == "")                                   
        { 
            window.alert("Please enter a valid e-mail address."); 
            email.focus(); 
            return false; 
        } 
       
        if (email.value.indexOf("@", 0) < 0)                 
        { 
            window.alert("Please enter a valid e-mail address."); 
            email.focus(); 
            return false; 
        } 
       
        if (email.value.indexOf(".", 0) < 0)                 
        { 
            window.alert("Please enter a valid e-mail address."); 
            email.focus(); 
            return false; 
        } 
       
       if (password.value == "")                        
        { 
            window.alert("Please enter your password"); 
            password.focus(); 
            return false; 
        if (mobile.value == "")                           
        { 
            window.alert("Please enter your mobile number."); 
            phone.focus(); 
            return false; 
        } 
        } 
        if (credential1.value == "")                        
        { 
            window.alert("Please provide your credential"); 
            password.focus(); 
            return false; 
        } 
        if (fingerprint.value == "")                        
        { 
            window.alert("Fingerprint data not available"); 
            password.focus(); 
            return false; 
        } 
       
        return true; 
    },

  submituser: function() {
    
    var name = document.forms["RegForm"]["Name"];               
    var address = document.forms["RegForm"]["Address"];    
    var email = document.forms["RegForm"]["Email"];  
    var password =  document.forms["RegForm"]["Password"];  
    var mobile = document.forms["RegForm"]["Mobile"];  
    var credential1 = document.forms["RegForm"]["Credential1"];  
    var credential2 = document.forms["RegForm"]["Credential2"];  
    var fingerprint = document.forms["RegForm"]["Fingerprint"];  
    if (name.value == "")                                  
    { 
        window.alert("Please enter your name."); 
        name.focus(); 
        return false; 
    } 
       
    if (email.value == "")                                   
    { 
        window.alert("Please enter a valid e-mail address."); 
        email.focus(); 
        return false; 
    } 
   
    if (email.value.indexOf("@", 0) < 0)                 
    { 
        window.alert("Please enter a valid e-mail address."); 
        email.focus(); 
        return false; 
    } 
   
    if (email.value.indexOf(".", 0) < 0)                 
    { 
        window.alert("Please enter a valid e-mail address."); 
        email.focus(); 
        return false; 
    } 
   
   if (password.value == "")                        
    { 
        window.alert("Please enter your password"); 
        password.focus(); 
        return false; 
    if (mobile.value == "")                           
    {  
        window.alert("Please enter your mobile number."); 
        phone.focus(); 
        return false; 
    } 
    } 
    if (credential1.value == "")                        
    { 
        window.alert("Please provide your credential"); 
        password.focus(); 
        return false; 
    } 
    if (fingerprint.value == "")                        
    { 
        window.alert("Fingerprint data not available"); 
        password.focus(); 
        return false; 
    } 

    var useremail = $('#Email').val();
    var useraddress = $('#Address').val();
    var userage = 20;
    var password=$('#Password').val()
    var fingerprint=$('#Fingerprint').val()
    var name=$('#Name').val()
    console.log(useremail);
    //var useraddress = $('#Address').val();
    App.contracts.identity.deployed().then(function(instance) {
      return instance.insertUser(name, useraddress, useremail, userage, password, fingerprint, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


