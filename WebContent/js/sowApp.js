var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	$http.defaults.headers.common['Accept'] = "application/json";
	$http.defaults.headers.common['Content-Type'] = "application/json";	
	
	//view all records
	$scope.readRecords = function(){
		$http.get("http://10.30.54.170:8082/sow/fetchAllSOW")		
	    .then(function(response) {
	        $scope.sowDetails = response.data;
	    });
		$("#update_user_modal").modal("hide");
	};	
	
	//insert new records
	$scope.addRecord = function(formData) {		
		//$scope.formData = {};	
		var owner =  $("#form_sowCurrency option:selected").val();
		
		if(!$("#form_sowNo").val()) {
             alert('Please fill the SOW Reference No');
             $("#form_sowNo").focus();
            /*$("#form_sowNo").css("border", "1px solid red");             
             $("#form_sowNo").focus(function(){
                 $(this).css("border", "1px solid red");
             });
             $("#form_sowNo").blur(function(){
                 $(this).css("border", "1px solid #ccc");;
             });*/
             return false;
         }if(owner == ""){
        	 alert('Please Select Owner');    
        	 $('#form_owner').focus();
             return false; 
             
         }if(!$("#form_resCount").val()){
        	 alert('Please fill the form_resCount');
        	 $('#form_resCount').focus();
             return false;
         }         
       else{ 
         $http.post("http://10.30.54.170:8082/sow/addSOW", angular.toJson(formData))		
		.then(function(response) {
			$scope.sowDetails = response.data;
			 $scope.readRecords();
 		});
        
         	$("#add_new_record_modal").modal("hide");			
        }
	};
		
	//Update a record
	$scope.GetUserDetails = function(id){		
		$http.get("http://10.30.54.170:8082/sow/fetchSOW?data="+id)	
		.then(function(response){				
			$scope.formModalData = response.data[0];
			//$scope.formData.valueMillion = formData.sowValue / 1000000;
		})
		// Open modal popup
		$("#update_user_modal").modal("show"); 	
	};
	
	//Save a record
	$scope.saveUserDetails = function(formModalData){		
		$http.post("http://10.30.54.170:8082/sow/addSOW/", angular.toJson(formModalData))	    
		.then(function(response) {
			$scope.sowDetails = response.data;
			$scope.readRecords();
 		});	   		
	   $("#update_user_modal").modal("hide");	   
	};
	
	//convert currency value start
	$scope.onCurConversion = function(cuType, cuVal){
		//console.log("onCurConversion cuVal::" + cuVal + " = cuType:: = " + cuType);
		$http.get("http://10.30.54.170:8082/sow/currCal?curtype="+cuType+"&"+"curvalue="+cuVal)	
		.then(function(response){
			$scope.formData.sowValue = response.data;
		});
	};	
	
	$scope.valDisabledUSD = true;
	$scope.valDisabledSGD = true;
	$scope.valDisabledMYR = true;
	$scope.valDisabledINR = true;
	
	$scope.updateCurVal = function(val){			
		if(val == "USD"){
			$scope.valDisabledUSD = false;
		}else if(val == "SGD"){			
			$scope.valDisabledSGD = false;
			$scope.valDisabledMYR = true;
			$scope.valDisabledINR = true;
		}else if(val == "MYR"){
			$scope.valDisabledMYR = false;
			$scope.valDisabledSGD = true;
			$scope.valDisabledINR = true;			
		}else if(val == "INR"){
			$scope.valDisabledINR = false;
			$scope.valDisabledMYR = true;
			$scope.valDisabledSGD = true;
		};		
	}	
	$scope.changeCurrency = function(cuType,cuVal){		
		if(cuType == "SGD"){
			$scope.onCurConversion(cuType,cuVal);			
		}else if(cuType == "MYR"){
			$scope.onCurConversion(cuType,cuVal);
		}
		else if(cuType == "INR"){
			$scope.onCurConversion(cuType,cuVal);
		}
	}
	//convert currency value end
});