

const firebaseConfig = {
  apiKey: "AIzaSyCDmtH9A7zo_Qb77HARlF0wrCVObm5Oabs",
  authDomain: "drivool-powertap.firebaseapp.com",
  databaseURL: "https://drivool-powertap-default-rtdb.firebaseio.com",
  projectId: "drivool-powertap",
  storageBucket: "drivool-powertap.firebasestorage.app",
  messagingSenderId: "306674472836",
  appId: "1:306674472836:web:ebf7237628e0c2286fefd1"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

function PowerTapAPIs(){

    this.fbDatabase = firebase.database()
    this.joCredential = {key:"",account:"drivoolapps"}
    this.joFileMap = {}
    this.strLastPowerTapId = undefined

    this.validateToken = (token,onResponse, onError)=>{
        let joParam = {
            token:token,
            time: Date.now()
        }
        let str10DigitNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        joParam.reqid = `${joParam.time}_${str10DigitNumber}`
    
        this.fbDatabase.ref(`Commands/Authenticate/${joParam.reqid}`).set(joParam)
        .then(() => {
                this.fbDatabase.ref(`Response/Authenticate/${joParam.reqid }`).on('value',(snapshot)=>{
                    if(snapshot !== null){
                        this.joCredential = snapshot.val()
                        // "Firebase ID token has "kid" claim which does not correspond to a known public key. Most likely the ID token is expired, so get a fresh token from your client app and try again."
                        if(this.joCredential !== null){
                            if(this.joCredential.err == undefined){
                                this.joCredential.account = this.joCredential.email.replace("@gmail.com","")
                                this.joCredential.account = this.joCredential.account.replaceAll(".","")
                                onResponse(this.joCredential)
                            }else{
                                console.log(JSON.stringify(this.joCredential.err))
                                const joErrorInfo = this.joCredential.err.errorInfo 
                                if(joErrorInfo != undefined && (joErrorInfo.code == "auth/id-token-expired" || joErrorInfo.code == "auth/argument-error")){                                    
                                    onError(`Token Expired`);
                                }
                            }

                        }
                        else{
                            onError(`No Response`);
                        }

                    }
                })
        })
        .catch((error) => {
            onError(`Error: ${error.message}`);
        });
    }

    this.executePowerTapAPI =  (strPowerTapId,joCommand, onResult, onError)=>{   

        if(this.joCredential == undefined){
            onError({err: "User credentail no set"})
            return
        }

        let joCredential = this.joCredential
        
        const timeNow = Date.now()
        
        joCommand.rid = `${timeNow}` // Request Id

        const joCommandToExecute = {
            key:joCredential.key,
            id:joCredential.account,
            cmd:joCommand,
            time: timeNow
        }

        this.fbDatabase.ref(`Response/PTD/${strPowerTapId}/${joCredential.account}/${joCommandToExecute.time}`)
        .on('value',(snapshot)=>{
                let joResult = snapshot.val()
                if(joResult !== null){
                    onResult({status:0, cmd:joResult.cmd, resp:joResult.resp})
                }
        })

        let fnOnFBSubmit = (error)=>{
            if (error) {
                //console.log('Data could not be saved.' + error);
                onError({err: "Failed to submit command " + error})
            } else {
                //console.log('Data saved successfully.');
                onResult({status:2, resp:{}})
            }
        }

        this.fbDatabase.ref(`Commands/PTD/${strPowerTapId}`).once('value',(snapshot)=>{
            let joCommand = snapshot.val()
            if(joCommand == null){
                this.fbDatabase .ref(`Commands/PTD/${strPowerTapId}`).set(joCommandToExecute,fnOnFBSubmit)
            }else{
                if(joCommandToExecute.id == joCommand.id){
                    this.fbDatabase .ref(`Commands/PTD/${strPowerTapId}`).set(joCommandToExecute,fnOnFBSubmit)
                }else if(joCommandToExecute.time > joCommand.time + 5000){
                    this.fbDatabase .ref(`Commands/PTD/${strPowerTapId}`).set(joCommandToExecute,fnOnFBSubmit)
                }else{
                    onError({err: "Device is being used by another user " + joCommand.id})
                }
            }
        })
    }
    //console.log(`Firebase database : ${database}`)
}

PowerTapAPIs.prototype.listenPowerTapState = function  (strPowerTapId, listener) {

    this.fbDatabase.ref(`PowerTapMonitor/${strPowerTapId}`).on('value',(snapshot)=>{
        if(snapshot !== null){
            listener(snapshot.val())
        }
    })
}

PowerTapAPIs.prototype.startCharging = function  (strPowerTapId, joParam, onResult,onError) {
    // To be done
    const joCommand = {"api": "RemoteStart", "param" : joParam}  ;
    this.executePowerTapAPI(strPowerTapId, joCommand, onResult, onError)
}

PowerTapAPIs.prototype.stopCharging = function  (strPowerTapId, joParam, onResult, onError) {
    const joCommand = {"api": "RemoteStop", "param" : joParam};
    this.executePowerTapAPI(strPowerTapId, joCommand, onResult, onError)
}

PowerTapAPIs.prototype.monitorCharging = function  (strPowerTapId, strTransactionId,  listener) {

    this.fbDatabase.ref(`ChargingSessions/${strPowerTapId}/${strTransactionId}`).on('value',(snapshot)=>{
        if(snapshot !== null){
            listener(strPowerTapId, strTransactionId, snapshot.val())
        }
    })
}

PowerTapAPIs.prototype.authenticate = function(onResponse, onError){

    let strOAuthToken = localStorage.getItem('oauthtoken');
    console.log(`strOAuthToken : ${strOAuthToken}`)
    if(strOAuthToken != null){
        this.validateToken(strOAuthToken,onResponse,(err)=>{
            console.log(`${err}`)
            if(err === "Token Expired"){
                localStorage.removeItem('oauthtoken')
                this.authenticate(onResponse,onError)
            }else{
                onError(err)
            }
            
        })
        return
    }
    
    auth.signInWithPopup(provider).then(result => {
        // Send the ID token to the server
        result.user.getIdToken().then(token => {   
            localStorage.setItem('oauthtoken', token);
            this.validateToken(token,onResponse,onError)
        });
    }).catch(error => onError(error));

}

PowerTapAPIs.prototype.executePTMAPI = function(strAPI, joParam, onResponse, onError){
    try {
        // Parse data as JSON and update Firebase
        const timeNow = Date.now()
        joParam.rid = `${timeNow}` // Request Id

        joParam.key = this.joCredential.key
        joParam.id = this.joCredential.account

        let joAPIData = {
            api:strAPI,
            param:joParam,
            time: Date.now()
        }

        this.fbDatabase.ref(`Commands/PTM/${joParam.id}`).set(joAPIData)
        .then(() => {
            //$('#result').text('API call successful! Waiting for resposne ...');
            this.fbDatabase.ref(`Response/PTM/${joParam.id}/${joAPIData.time}`).on('value',(snapshot)=>{
                if(snapshot !== null){
                    onResponse(snapshot.val())
                }
                
            })
        })
        .catch((error) => {
            onError(`Error: ${error.message}`);
        });
    } catch (error) {
        onError(`Error: ${error.message}`);
    }
}


PowerTapAPIs.prototype.addPowerTap = function  (joAccount, joPowerTap,onResult, onError) {

    let joParam = {
        account: joAccount.account,
        apptype: joAccount.apptype,
        bbcid : joPowerTap.id,
        name :joPowerTap.name,
        model : joPowerTap.model,
        group : joPowerTap.group
    }
    this.executePTMAPI("AddPowerTap",joParam, onResult, onError)
}



PowerTapAPIs.prototype.deletePowerTap = function  (joAccount,joPowerTaps,onResult, onError) {

    let joParam = {
        powertaps :joPowerTaps,
        account: joAccount.account,
        apptype: joAccount.apptype
    }
    this.executePTMAPI("DeletePowerTap",joParam, onResult, onError)
}

PowerTapAPIs.prototype.getPowerTapsList = function  (joAccount, onResult, onError) {

    let joParam = {
        account: joAccount.account,
        apptype: joAccount.apptype
    }

    this.executePTMAPI("GetPowerTapsList",joParam, onResult, onError)
}

PowerTapAPIs.prototype.logout = function  (onResult, onError) {
    firebase.auth().signOut()
    .then(() => {
        onResult()
    })
    .catch((error) => {
        onError(error)
    });
}

PowerTapAPIs.prototype.autoAuthenticate = function  (handleCredentialResponse) {
    // google.accounts.id.initialize({
    //     client_id: "017688382963-shlamifljnqs2d3dsnsl0c1r8kmmb2ck.apps.googleusercontent.com",  // Replace with your Google Client ID
    //     callback: handleCredentialResponse
    // });
    // google.accounts.id.prompt();
}


