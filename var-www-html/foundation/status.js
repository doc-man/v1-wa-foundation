var $ = jQuery;


var canUserInteractWithContract = false;
// Ref: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check     
window.addEventListener('load', function() {
    console.log("inside window addevent listerner load");
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
        console.log("Using Mist/MetaMask's provider");
        let Web3 = require('web3');
        web3 = new Web3();
        web3.setProvider(window.web3.currentProvider);
	    canUserInteractWithContract = true;
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/hvBxnkcxO7nF9ptQPkjz:8545"));
	    canUserInteractWithContract = false;
    }
    
    // Now you can start your app & access web3 freely:
    startApp();

});    



var tokenContractUrl       = './build/contracts/HealthToken.json';
var foundationContractUrl  = './build/contracts/FoundationContract.json';
var votingContractUrl      = './build/contracts/SimpleVoting.json';

let web3;
let foundation  = "0xfc7acfda96972316725512b6109441621ebd2d28";    
let votingContractAddress; // this value is retrieved from foundation

function loadContract(url, callback){
    $.ajax(url,{'dataType':'json', 'cache':'false', 'data':{'t':Date.now()}}).done(callback);
}
var proposalRowCount = 0;
function createProposalsTableRow(pContractInstance, numberOfProposals) {
    let proposalNumber = proposalRowCount;
    console.log("call createProposalsTableRow", proposalNumber, numberOfProposals);
    if(proposalNumber < numberOfProposals) {
        pContractInstance.getProposal(proposalNumber,function(error, result){
            if(!error){
                var proposal = {};
                proposal.recipient = result[0];
                proposal.amount = result[1].toString();
                proposal.description = result[2];
                proposal.votingDeadline = result[3];
                proposal.numberOfVotes = result[4];
                proposal.executed = result[5];
                proposal.proposalPassed = result[6];
                proposal.typeOfProposal = result[7];

                let proposalsTableBody ="<tr>";
                proposalsTableBody+="<td>"+proposalNumber+"</td>";                                            
                proposalsTableBody+="<td>"+proposal.recipient+"</td>";
                let amount = web3.fromWei(proposal.amount, 'ether');
                proposalsTableBody+="<td>"+amount+"</td>";
                proposalsTableBody+="<td>"+proposal.description+"</td>";
                var date = new Date(proposal.votingDeadline*1000);
                var millisecondsOfProposal = date.getTime();
                var millisecondsOfNow = new Date().getTime();
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                proposalsTableBody+="<td>"+timeConverter(proposal.votingDeadline)+"</td>";
                if(millisecondsOfNow < millisecondsOfProposal) {
                    proposalsTableBody+="<td>"+"<span class='badge badge-pill badge-info cDefault opacity-6' style='margin-right: 5px;'>"+proposal.numberOfVotes+"</span>"+"<label class='form-check-label padding-r6'><input type='radio' class='form-check-input' name='vote_"+proposalNumber+"' value='for'> For </label><label class='form-check-label padding-r6'><input type='radio' class='form-check-input' name='vote_"+proposalNumber+"' value='against'> Against </label></div>"
                        + "<input type='button' id='submitVote_"+proposalNumber+"' onclick='submitVoteMain("+proposalNumber+")' value='Submit Vote' class='btn-c btn-primary-c'>"
                        + "</td>";
                } else {
                    proposalsTableBody+="<td><span class='badge badge-pill badge-success cDefault opacity-6' style='margin-right: 5px;'>"+proposal.numberOfVotes+"</span></td>";
                }
                if(proposal.numberOfVotes != 0 && proposal.proposalPassed != true && millisecondsOfNow > millisecondsOfProposal) {
                    proposalsTableBody+="<td>"+"<input type=button id='submitCountVotesBtn' onclick='submitCountVotes("+proposalNumber+")' value='count votes' class='btn-c btn-primary-c'></td>";
                } else if(proposal.proposalPassed == true) {
                    proposalsTableBody+="<td>"+"<span class='badge badge-pill badge-success cDefault opacity-6'>Success</span>"+"</td>";
                } else {
                    proposalsTableBody+="<td>"+"</td>";
                }
                if(proposal.proposalPassed == true && proposal.executed != true) {
                    proposalsTableBody+="<td>"+"<input type=button id='submitExecuteProposalBtn' onclick='submitExecuteProposal("+proposalNumber+")' value=execute class='btn-c btn-primary-c'></td>";
                } else if(proposal.executed == true){
                    proposalsTableBody+="<td>"+"<span class='badge badge-pill badge-success cDefault opacity-6'>Success</span>"+"</td>";
                } else {
                    proposalsTableBody+="<td>"+"</td>";
                }
                if(proposal.typeOfProposal) {
                    proposalsTableBody+="<td>"+proposal.typeOfProposal+"</td>";
                } else {
                    proposalsTableBody+="<td>"+"</td>";
                }
                
                proposalsTableBody+="</tr>";
                $("table[id=proposalsTable]").find('tbody').append(proposalsTableBody);
            } else {
                console.log('Can\'t find proposals', error);
            }
            proposalRowCount ++;
            createProposalsTableRow(pContractInstance, numberOfProposals);
        });
    } else {
        $('#proposalsTable')
            .addClass( 'nowrap' )
            .dataTable( {
                responsive: true,
                searchHighlight: true,
                columnDefs: [
                    { targets: [-1, -3], className: 'dt-body-right' }
                ]
            } );
    }
}
var eathAccountsAddress = null;
function startApp(){

    let tokenContract;
    let foundationContract;
    let votingContract;
    // var accounts = web3.eth.accounts;
    // eathAccountsAddress = accounts;
    // setTimeout(function(){ alert(web3.eth.accounts); }, 100);
    loadContract(tokenContractUrl, function(data){
        tokenContract = data;
    });

    loadContract(foundationContractUrl, function(data){
        foundationContract = data;
        let contractObj = web3.eth.contract(foundationContract.abi); //The json interface for the contract to instantiate

        $('input[name=foundation]','#dashboardForm').val(foundation);
        document.getElementById("foundationAddressLink").href="https://rinkeby.etherscan.io/address/"+foundation;
        var x = document.getElementById("gitGubSrcCodeFun");
        x.style.display = "";
        pContractInstance = contractObj.at(foundation);

        pContractInstance.token(function(error, result){
            if(!error){
                var accounts = web3.eth.accounts;
                eathAccountsAddress = accounts[0];
                if(eathAccountsAddress){
                    $('#showAdress').text(eathAccountsAddress);
                } else {
                    $('#showAdress').html('<span style="color:#da7b7b !important">Not detected</span>');
                }
                var networkName = null;
                // networkId = web3.version.network;
                // console.log(web3.version.network);
                web3.version.getNetwork((err, networkId) => {
                    switch (networkId) {
                        case "1":
                            networkName = "Main";
                            break;
                        case "2":
                            networkName = "Morden";
                            break;
                        case "3":
                            networkName = "Ropsten";
                            break;
                        case "4":
                            networkName = "Rinkeby";
                            break;
                        case "42":
                            networkName = "Kovan";
                            break;
                        default:
                            networkName = "Unknown";
                    }
                    if(eathAccountsAddress != null){
                        $('#showNetwork').text(networkName);
                    } else {
                        $('#showNetwork').html('<span style="color:#da7b7b !important">Not detected</span>');
                    }
                });
                document.getElementById("tokenAddressLick").href="https://rinkeby.etherscan.io/address/"+result;
                $('input[name=token]','#dashboardForm').val(result);
                var pc = document.getElementById("pieChart");
                    pc.style.display = "";
                var x = document.getElementById("gitGubSrcCodeToken");
                x.style.display = "";
                var previousBlock = 1000;
                var options = {
                    fromBlock: previousBlock,
                    toBlock: previousBlock + 100,
                    address: result,
                };
                var filter = web3.eth.filter(options);
                
                // console.log('Token address');
                // filter.get(function(error, result){
                //     console.log(error, result);
                //     if (!error)
                //         console.log(JSON.stringify(result, null, 2));
                //     });
            }else{
                console.log('Can\'t find token address', error);
            }
        });

        pContractInstance.getTokenBalance(function(error, result){
            if(!error){
                let amount = web3.fromWei(result, 'ether');
                $('input[name=numberOfHLT]','#dashboardForm').val(amount);
            }else{
                console.log('Can\'t find numbner of HLT', error);
            }
        });
        pContractInstance.getEtherBalance(function(error, result){
            if(!error){
                let amount = web3.fromWei(result, 'ether');
                $('input[name=numberOfEther]','#dashboardForm').val(amount);
            }else{
                console.log('Can\'t find number of ether', error);
            }
        });

        pContractInstance.votingContract(function(error, result){
            if(!error){
                document.getElementById("votingAddressLick").href="https://rinkeby.etherscan.io/address/"+result;
                $('input[name=votingContract]','#dashboardForm').val(result);
                var x = document.getElementById("gitGubSrcCodeVoting");
                x.style.display = "";
                loadContract(votingContractUrl, function(data){
                    votingContract = data;
                    let contractObj = web3.eth.contract(votingContract.abi); //The json interface for the contract to instantiate
        
                    votingContractAddress = $('input[name=votingContract]','#dashboardForm').val();
                    pContractInstance = contractObj.at(votingContractAddress);
        
                    pContractInstance.minimumQuorum(function(error, result){
                        if(!error){
                            let amount = web3.fromWei(result, 'ether');
                            $('input[name=minimumQuorum]','#dashboardForm').val(amount);
                            if(amount == null || amount == 0 || amount == '') {
                                var x = document.getElementById("initializeSimpleVotingBtn");
                                x.style.display = "";
                            }
                            
                        }else{
                            console.log('Can\'t find minimum quorum', error);
                        }
                    });
        
                    pContractInstance.debatingPeriodInSeconds(function(error, result){
                        if(!error){
                            $('input[name=debatingPeriodInSeconds]','#dashboardForm').val(result);
                            var dBtn = document.getElementById("changeDebatingPeriodBtn");
                            dBtn.style.display = "inline";
                        }else{
                            console.log('Can\'t find debating Period In Seconds', error);
                        }
                    });
    
                    let numberOfProposals = 0;
                    let proposals = new Array();
                    pContractInstance.getProposalsCount(function(error, result){
                        if(!error){
                            $('input[name=numProposals]','#dashboardForm').val(result);
                            var pBtn = document.getElementById("createNewProposal");
                            pBtn.style.display = "inline";
                            numberOfProposals = $('input[name=numProposals]','#dashboardForm').val();
                            // inside the for loop I am calling a async function. For loop will funish running immediately. While all your asynchronous operations are started. 
                            // Ref: https://stackoverflow.com/questions/11488014/asynchronous-process-inside-a-javascript-for-loop
                            // let proposalNumber = 0;
                            
                            // numberOfProposals = 1;
                            if(numberOfProposals > 0) {
                                // proposalsTable += "<script type='text/javascript' src='status.js'></script>";
                                // let proposalsTable = "<script type='text/javascript' src='status.js'></script><script>"
                                // + "function submitVote(proposalNumber) {"
                                // +    "console.log('call fn js', proposalNumber);"
                                // +    "submitVoteMain(proposalNumber);"
                                // + "}"
                                // +"</script>";
                                
                                let proposalsTable = "<table id='proposalsTable' class='table font-sm display table-sort-show-search-count' style='width: 100%;'><thead style='background-color: #bdbdbd;'><tr>"
                                    + "<th>Proposal ID</th>"
                                    + "<th>Recipient</th>"
                                    + "<th>Amount (HLT/Ether)</th>"
                                    + "<th>Description</th>"
                                    + "<th>Voting Deadline</th>"
                                    + "<th># of votes</th>"
                                    + "<th>Proposal passed</th>"
                                    + "<th>Executed</th>"
                                    + "<th>Type of proposal</th>"
                                + "</tr></thead><tbody id='proposalsTableBody'></tbody>";
                                proposalsTable += "</table>";
                                $("div[id=viewProposalsTable]").html(proposalsTable);
                                
                                createProposalsTableRow(pContractInstance, numberOfProposals);
                            }     
                        } else {
                            console.log('Can\'t find numProposals', error);
                        }
                    });
                });
            } else {
                console.log('Can\'t find voting contract address', error);
            }              
        });
    });
};

function timeStringToTimestamp(str){
    return Math.round(Date.parse(str)/1000);
}
function timeTimestampToLocalString(timestamp){
    let tzoffset = (new Date()).getTimezoneOffset()*60*1000;
    return (new Date(timestamp-tzoffset)).toISOString().slice(0,19);
}
function timeDateToLocalString(date){
    let tzoffset = (new Date()).getTimezoneOffset()*60*1000;
    return (new Date(date.getTime()-tzoffset)).toISOString().slice(0,19);
}


function printError(msg){
    if(msg == null || msg == ''){
        $('#errormsg').html('');    
    }else{
        console.error(msg);
        $('#errormsg').html(msg);
    }
}

// ref: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
    }

window.submitVoteMain = function (rowIndex) {
    if(canUserInteractWithContract == false) {
        alert('Please install metamask to interact with the contract.');
        return false;
    }
    loadContract(votingContractUrl, function(data){
        votingContract = data;

        var form = $('#dashboardForm');
        let votingAddress = $('input[name=votingContract]', form).val();
        console.log('votingAddress:', votingAddress);
        let proposalNumber  = rowIndex;
        let voteRadio = $('input[name=vote_'+rowIndex+']:checked');
        if(voteRadio.length != 1){
            alert('No vote selected!');
            return;
        }
        let vote;
        switch(voteRadio.val()){
            case 'for':
                vote = true;
                break;
            case 'against':
                vote = false;
                break;
            default:
                alert('Unknown vote!');
                return;
        }
        let contractObj = web3.eth.contract(votingContract.abi);
        let contractInstance = contractObj.at(votingAddress);
        console.log('Calling '+votingContract.contract_name+'.vote() with parameters:\n', 
            proposalNumber, vote,
            'ABI', JSON.stringify(votingContract.abi));
        contractInstance.vote(
            proposalNumber, vote,
            function(error, result){
                if(!error){
                    console.log("Vote tx: ",result);
                }else{
                    console.error(error)
                }
            }
        );
    });
}
window.submitCountVotes = function (rowIndex) {
    if(canUserInteractWithContract == false) {
        alert('Please install metamask to interact with the contract.');
        return false;
    }
    loadContract(votingContractUrl, function(data){
        votingContract = data;

        var form = $('#dashboardForm');
        let votingAddress = $('input[name=votingContract]', form).val();
        console.log('votingAddress:', votingAddress);
        let proposalNumber  = rowIndex;
        let contractObj = web3.eth.contract(votingContract.abi);
        let contractInstance = contractObj.at(votingAddress);
        console.log('Calling '+votingContract.contract_name+'.executeVoting() with parameters:\n', 
            proposalNumber,
            'ABI', JSON.stringify(votingContract.abi));
        contractInstance.executeVoting(
            proposalNumber,
            function(error, result){
                if(!error){
                    console.log("Execute voting tx: ",result);
                }else{
                    console.error(error)
                }
            }
        );
    });
}
window.submitExecuteProposal = function (rowIndex) {
    if(canUserInteractWithContract == false) {
        alert('Please install metamask to interact with the contract.');
        return false;
    }
    loadContract(votingContractUrl, function(data){
        votingContract = data;

        var form = $('#dashboardForm');
        let votingAddress = $('input[name=votingContract]', form).val();
        console.log('votingAddress:', votingAddress);
        let proposalNumber  = rowIndex;
        let contractObj = web3.eth.contract(votingContract.abi);
        let contractInstance = contractObj.at(votingAddress);
        console.log('Calling '+votingContract.contract_name+'.executeProposal() with parameters:\n', 
            proposalNumber,
            'ABI', JSON.stringify(votingContract.abi));
        contractInstance.executeProposal(
            proposalNumber,
            function(error, result){
                if(!error){
                    console.log("Execute voting tx: ",result);
                }else{
                    console.error(error)
                }
            }
        );
    });
}

jQuery(document).ready(function($) {
    
    $('#createNewProposal').click(function(){
        if(canUserInteractWithContract == false) {
            alert('Please install metamask to interact with the contract.');
            return false;
        }
        console.log("called create new proposal");
        var x = document.getElementById("proposalFormDiv");
        x.style.display = "block";
        var pBtn = document.getElementById("createNewProposal");
        pBtn.style.display = "none";
        
    });

        
    $('#cancleCreateNewProposal').click(function(){
        var x = document.getElementById("proposalFormDiv");
        x.style.display = "none";
        var pBtn = document.getElementById("createNewProposal");
        pBtn.style.display = "inline";
    });
    $('#submitTokenProposal').click(function(){
        if(canUserInteractWithContract == false) {
            alert('Please install metamask to interact with the contract.');
            return false;
        }
        loadContract(votingContractUrl, function(data){
            votingContract = data;
            var mainForm = $('#dashboardForm');
            let votingAddress = $('input[name=votingContract]', mainForm).val();
            console.log('votingAddress:', votingAddress);
            
            let beneficiary = $('input[name=beneficiary]').val();
            let amount = web3.toWei($('input[name=amount]').val(), 'ether');
            let description = $('input[name=description]').val();

            let contractObj = web3.eth.contract(votingContract.abi);
            let contractInstance = contractObj.at(votingAddress);
            console.log('Calling '+votingContract.contract_name+'.newTokenProposal() with parameters:\n', 
                beneficiary, amount, description,
                'ABI', JSON.stringify(votingContract.abi));

            contractInstance.newTokenProposal(
                beneficiary, amount, description,
                function(error, result){
                    if(!error){
                        console.log("Proposal tx: ",result);
                        var x = document.getElementById("proposalFormDiv");
                        x.style.display = "none";
                        var pBtn = document.getElementById("createNewProposal");
                        pBtn.style.display = "inline";
                        // $('input[name=publishedTx]',form).val(result);
                    }else{
                        console.error(error)
                    }
                }
            );
        });
    });

    $('#initializeSimpleVotingBtn').click(function(){
        if(canUserInteractWithContract == false) {
            alert('Please install metamask to interact with the contract.');
            return false;
        }
        var mainForm = $('#dashboardForm'); 
        var minimumQuorum = $('input[name=minimumQuorum]', mainForm).val();
        if(minimumQuorum == null || minimumQuorum == 0 || minimumQuorum == ''){
            loadContract(foundationContractUrl, function(data){
                foundationContract = data;
                let votingAddress = $('input[name=votingContract]', mainForm).val();
                console.log('votingAddress:', votingAddress);   
                let foundationAddress = $('input[name=foundation]', mainForm).val();
                console.log('foundation:', foundation);   
                let contractObj = web3.eth.contract(foundationContract.abi);
                let contractInstance = contractObj.at(foundationAddress);
                console.log('Calling '+foundationContract.contract_name+'.initVotingContract() with parameters:\n', 
                    votingAddress,
                    'ABI', JSON.stringify(foundationContract.abi));
                contractInstance.initVotingContract(
                    votingAddress,
                    function(error, result){
                        if(!error){
                            console.log("Init tx: ",result);
                            $('input[name=publishedTx]','#initializeFoundationForm').val(result);
                        }else{
                            console.error(error)
                        }
                    }
                );
            });
        }
    });

    $('#changeDebatingPeriodBtn').click(function(){
        if(canUserInteractWithContract == false) {
            alert('Please install metamask to interact with the contract.');
            return false;
        }
        var x = document.getElementById("changeDebatingPeriodFormDiv");
        x.style.display = "block";
        var dBtn = document.getElementById("changeDebatingPeriodBtn");
        dBtn.style.display = "none";
    });
    $('#cancleChangeVotingRules').click(function(){
        var x = document.getElementById("changeDebatingPeriodFormDiv");
        x.style.display = "none";
        var dBtn = document.getElementById("changeDebatingPeriodBtn");
        dBtn.style.display = "inline";
    });
    $('#submitChangeVotingRules').click(function(){
        if(canUserInteractWithContract == false) {
            alert('Please install metamask to interact with the contract.');
            return false;
        }
        loadContract(votingContractUrl, function(data){
            votingContract = data;
            var mainForm = $('#dashboardForm');
            let votingAddress = $('input[name=votingContract]', mainForm).val();
            console.log('votingAddress:', votingAddress);
            
            let votesNumber = $('input[name=votesNumber]').val();
            let votingDeadline = $('input[name=votingDeadline]').val();

            let contractObj = web3.eth.contract(votingContract.abi);
            let contractInstance = contractObj.at(votingAddress);
            console.log('Calling '+votingContract.contract_name+'.changeVotingRules() with parameters:\n', 
                    votesNumber, votingDeadline,
                    'ABI', JSON.stringify(votingContract.abi));
            contractInstance.changeVotingRules(
                votesNumber, votingDeadline,
                function(error, result){
                    if(!error){
                        console.log("Execute voting tx: ",result);
                        var x = document.getElementById("changeDebatingPeriodFormDiv");
                        x.style.display = "none";
                        var dBtn = document.getElementById("changeDebatingPeriodBtn");
                        dBtn.style.display = "inline";
                    } else {
                        console.error(error)
                    }
                }
            );
        });
    });
}); 
