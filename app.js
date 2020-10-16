var budgetController=(function(){
    var Expences=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
		this.Percentage=-1;
    }
	
	Expences.prototype.calcPercentage=function(totalIncome){
		if (totalIncome>0){
			this.Percentage=Math.round((this.value/totalIncome)*100);
		}
		else{
			this.Percentage=-1;
		}
		//console.log(this.Percentage);
		return this.Percentage;//console.log(this.Percentage);
	};
	
// Expense.prototype.getPercentage = function() {
 //       return this.percentage;
  //  };
    var Incomes=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
   
        
 									
									
    
    var data ={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
    },
		budget:0,
		percentage:-1
    };
      
    var calcTotal=function(type){
        sum=0;
        data.allItems[type].forEach(function(current){
            sum=sum+current.value;
            })
									
			data.totals[type]=sum;
        }                 
    return {
    addItem:function(type,description,value){
        var newItem,ID;
        if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id +1 ;
        }
        else {
            ID=0;
        }
        if(type==="exp"){
            newItem=new Expences(ID,description,value);
        }
        else{
            newItem=new Incomes(ID,description,value);
        }
        data.allItems[type].push(newItem);
    return newItem;
    },
		calculatePercentages:function(){
		var per=data.allItems.exp.map(function(cur){
			
			return cur.calcPercentage(data.totals.inc);
		});	
			console.log(per);
			return per;
		},
		
//		getPercentages:function(){
//			var per=data.allItems.exp.map(function(cur){
//				return cur.getPercentage;
//			});
//			return per;
		//},
		calcBudgetTotal:function(){
			calcTotal("inc");
			calcTotal("exp");
			data.budget=data.totals.inc - data.totals.exp;
			if(data.totals.inc>0){
			data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
			}
			else{
				data.percentage=-1;
			}
			//console.log(data.percentage);
			//console.log(data.budget);
		},
			totalItems:function(){
				return{
					totalInc:data.totals.inc,
					totalexp:data.totals.exp,
					totalBudget:data.budget,
					percentage:data.percentage
				};
			},
		deleteBudget:function(type,ID){
			var ids,index;
			
			ids=data.allItems[type].map(function(current){ 
				return current.id;  //returns a new array ith same lenght as item with available id elements
			})
			index=ids.indexOf(ID);
			data.allItems[type].splice(index,1);
		},
		
        
        testing:function(){
                console.log(data);
        }
    };
                      
                      
                      
})();
var UIcontroller=(function(){
    var DOMStrings={
        inputType:".add__type",
        inputDescription:".add__description",
        inputValue:".add__value",
        inputBtn:".add__btn",
        incomeContainer:".income__list",
        expensesContainer:".expenses__list",
		budgetValue:".budget__value",
		incomeValue:".budget__income--value",
		expenseValue:".budget__expenses--value",
		expensePerc:".budget__expenses--percentage",
		container:".container ",
		percentageLabel:".item__percentage",
		dateLabel:".budget__title--month"
    };
	var nodeListFor=function(list,callback){
				for(var i=0;i<list.length;i++){
					callback(list[i],i)
				}
			};
	
	var FormatNumb=function(num,type){
		var int,dec;
		num=Math.abs(num);
		num=num.toFixed(2);
		num=num.split(".");
		int=num[0];
		dec=num[1];
		if(int.length>3){
			int = int.substr(0,int.length-3)+','+ int.substr(int.length-3,3);
		}
		
		return (type === 'exp' ? '-' : '+') + ' ' + int + '.'+dec;
		
		
	}
    return{
        getInput:function(){
            return{
                type:document.querySelector(DOMStrings.inputType).value,
                description:document.querySelector(DOMStrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
		colour:function(){
			var fields=document.querySelectorAll(DOMStrings.inputType+","+DOMStrings.inputDescription+","+DOMStrings.inputValue);
			
			nodeListFor(fields,function(current){
				current.classList.toggle("red-focus");
			})
			
			document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
		},
        addListItem:function(obj,type){
            var html,service;
            if(type==="inc")
                {
                service=DOMStrings.incomeContainer;
                html= '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value"> %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>    </div> </div> </div>   '
                }
            else{
                service=DOMStrings.expensesContainer;
                html= '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value"> %value%</div> <div class="item__percentage">10%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
                
            }
            html=html.replace("%id%",obj.id);
            html=html.replace("%description%",obj.description);
            html=html.replace("%value%",FormatNumb(obj.value,type));
            document.querySelector(service).insertAdjacentHTML("beforeend",html);
        },
		deleteUI : function(itemID){
			document.getElementById(itemID).parentNode.removeChild(document.getElementById(itemID));
		},
        clearFields:function(){
           var field,fieldArray;  
           field= document.querySelectorAll(DOMStrings.inputDescription +","+ DOMStrings.inputValue);
           fieldArray=Array.prototype.slice.call(field);
            fieldArray.forEach(function(current,index,array){
                current.value='';
            })
            fieldArray[0].focus();
        },
		
		
		displayPerc:function(arrayPerc){
			var fields=document.querySelectorAll(DOMStrings.percentageLabel);
			//console.log(arrayPerc);
			
			
			nodeListFor(fields,function(current,index){
				if(arrayPerc[index]>0){
					console.log(arrayPerc);
					current.textContent=arrayPerc[index] + "%";
					}
					else{
						current.textContent="---";
					}
			})
			
		},
		dispalyMonth:function(){
			var month,year;
			var months=["January","February","March","Äpril","May","June",
			"July","Äugust","September","Öctober","November","December"]
			
			var date=new Date();
			month=date.getMonth();
			year=date.getFullYear();
			document.querySelector(DOMStrings.dateLabel).textContent=months[month]+" "+year;
			
			},
		displayBudget:function(obj){
			var type;
			if (obj.totalBudget > 0){
				type="inc";
			}
			else{
				type="exp";
			}
			document.querySelector(DOMStrings.budgetValue).textContent=FormatNumb(obj.totalBudget,type);
			document.querySelector(DOMStrings.incomeValue).textContent=FormatNumb(obj.totalInc,'inc');
			document.querySelector(DOMStrings.expenseValue).textContent=FormatNumb(obj.totalexp,"exp");
			
			if (obj.percentage > 0){
			document.querySelector(DOMStrings.expensePerc).textContent=obj.percentage+"%";
			}
			else{
				document.querySelector(DOMStrings.expensePerc).textContent="---";
			}
		},
		
        getDOMStrings:function(){
           return DOMStrings;    
        }
        
    };
    
})();

var controller=(function(budgetCtlr,UICtrl){
    
    var init=function(){
        var DOM =UICtrl.getDOMStrings(); 
		UICtrl.dispalyMonth();
		document.querySelector(DOM.inputBtn).addEventListener("click",ctrlAddItem);
        document.addEventListener("keypress",function(event){
            if(event.keyCode ===13 || event.which ===13){
                ctrlAddItem();
            }
        });
		document.querySelector(DOM.container).addEventListener('click',deleteElement);
		document.querySelector(DOM.inputType).addEventListener("change",UICtrl.colour);
    }

	
	var updateBudget=function(){
	   budgetCtlr.calcBudgetTotal();
	   var displayValues=budgetCtlr.totalItems();
	  // console.log(displayValues);
   	   UICtrl.displayBudget(displayValues);
   }
	
	
    var updatePercentage=function(){
		var arrayPerc=budgetCtlr.calculatePercentages();
		
	//	var arrayPerc=budgetCtlr.getPercentages();
		console.log(arrayPerc);
				
		UICtrl.displayPerc(arrayPerc);
		
		
	}
    
   var ctrlAddItem=function(){ // constructor nde function aan
       var input,newItem;
       input=UICtrl.getInput();
       
       if(input.description !=="" && !isNaN(input.value) && input.value>0){
       newItem=budgetCtlr.addItem(input.type,input.description,input.value);
       UICtrl.addListItem(newItem,input.type);
       UICtrl.clearFields();
	   updateBudget();
	   updatePercentage();
       }
   }
   
   
   
   
    	var deleteElement = function(event){
		var itemID,split,item,ID; 
		
		itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			split=itemID.split("-");
			item=split[0];
			ID=parseInt(split[1]);

		budgetCtlr.deleteBudget(item,ID);
		UICtrl.deleteUI(itemID);
		updateBudget();
		updatePercentage();
		}
	}
   
   
   
   
   
   return{
       init:function(){
           return init();
       }
	   
   }
    
})(budgetController,UIcontroller);

controller.init();






