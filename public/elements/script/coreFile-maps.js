
/*Title : Core file containing all the functions in our application
Created : June 28, 2017 2:00 PM
Author : Shilpa
This code creates a document detailing all the functions of our application.
Revisions :
Version : 
Date :7/8/2017
Author :Ankita
Changes :
Improved the conclusion section

Date :7/27/2017
Author :Shivnesh
Changes :
 * Building info Tab 1 functionalities - buildingInf()
 * Building info Tab 2 functionalities - buildingMoreInfo()
 * Overview tab - table click functionality - drawTable() & drawTable_State()
 * Overview tab - drawChartLeftTop()
 * unique - prototype to get unique values in an Array
Added references*/



//Variable declarations

var buildingName;
var dataJson = [];
var buildingMIStarted=0;
var array = [];
var vectorLayer;
var map21;
var map31;
var overlay;
var selectedCustomer = [], selectedAgency = [], selectedState = [], selectedUtility = [], selectedData = [], selectedContract = [],
    selectedSolar = [], selectedEmgen = [], selectedBattery = [], selectedCogen = [], selectedFuel = [], selectedStage = [], selectedStage3 = [],
    selectedEnergy = [], selectedRenewable = [];

	
// Function to populate the middle table in the overview tab
function drawTable(data) {
    data = JSON.parse(JSON.parse(data).data);
    var nameMapping = {
        Facility_Name: "Facility Name",
        Building_Name: "Building Name",
        Agency: "Agency",
        Total_Mu_Sigma_Score: "Score",
    };
    var keys = d3.keys(nameMapping);
    var table = d3.select("#table_building");
    table.selectAll("*").remove();
    var tbodies = table.append("tbody");
    var rows = tbodies.selectAll("tr").data(data);
    rows = rows.enter().append("tr");
    var dataCells = rows.selectAll("td")
        .data(function (d) {
            var values = d3.keys(nameMapping).map(function (key) {
                return d[key];
            });
            return values;
        });
    dataCells.enter().append("td").text(function (d, i) {
        return d;
    });
   // On click of building name, redirects to building info tab 1
    rows.on("click", function (d) {
        buildingName = d.Building_Name
        //window.location.href = "/#/overview"
        if (buildingName != "NA") {
            window.location.assign("/#/buildinginf")
            buildingInf()
        }
    });
};


// Function to populate the middle table in the state tab
function drawTable_State(data) {
    data = JSON.parse(JSON.parse(data).data);
    var nameMapping = {
        Facility_Name: "Facility Name",
        Building_Name: "Building Name",
        Agency: "Agency",
        Total_Mu_Sigma_Score: "Score",
    };

    var keys = d3.keys(nameMapping);

    var table = d3.select("#table_building_State");
    table.selectAll("*").remove();

    // var ths = theads.selectAll('th').data(keys).enter().append("th").text(function(d) {
    //     return nameMapping[d];
    // });

    var tbodies = table.append("tbody");
    var rows = tbodies.selectAll("tr").data(data);
    rows = rows.enter().append("tr");

    var dataCells = rows.selectAll("td")
        .data(function (d) {
            var values = d3.keys(nameMapping).map(function (key) {
                return d[key];
            });
            return values;
        });
    dataCells.enter().append("td").text(function (d, i) {
        return d;
    }).style('width', function (d) {		
        return '25%';
	  });
	
     // On click of building name, redirects to building info tab 1
    rows.on("click", function (d) {
        buildingName = d.Building_Name
        //window.location.href = "/#/overview"
        if (buildingName != "NA") {
            window.location.assign("/#/buildinginf")
            buildingInf()
        }
    });
};


//function to create request
function makeRequest(type, fullUrl, callback) {
    var request = new XMLHttpRequest();
    request.open(type, fullUrl, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.onreadystatechange = function () {
        if (request.readyState > 3) {
            if (request.status === 200) {
                callback(null, request.response);
            } else {
                callback(request.response, null);
            }
        }
    };
    request.send();
}


//function to get unique values as key-value pairs
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {

            seen[item] = 1;
            out.push({
                "key": item,
                "val": item
            });
        }
    }
    return out;
}



//function attached with summarry tab
function firstfunction() {

    data = [{ "Grade": "D", "Description": "Records containing Name of the Building, Location, Agency", "No. of records": "15,039" },
    { "Grade": "C", "Description": "Records containing annual energy consumption,Energy Intensity,sq. ft.", "No. of records": "5678" },
    { "Grade": "B", "Description": "Records containing First Fuel Score, Grade C or D or C+D info", "No. of records": "5678" },
    { "Grade": "A", "Description": "Records containing Potential ECM Data + Grade B/C/D or the mixture of other 3 grades", "No. of records": "5678" }]
    document.getElementById("table1").tableData = data
    document.getElementById("table1").filterable = false
}


//Function to get unique values 
Array.prototype.unique = function () {
    var n = {}, r = [];
    for (var i = 0; i < this.length; i++) {
        if (!n[this[i]]) {
            n[this[i]] = true;
            r.push(this[i]);
        }
    }
    return r;
}


//function to draw the left top chart in Overview tab(StateVSOpportunities) and in State view tab (AgencyVSOpportunities)
function drawChartLeftTop(filterData, opportunitiesData, stateNamesData, chartId) {
    //Initialising number of states and agencies
    var numStates = 57;
	if(chartId == "chartlefttop_agency" || chartId == "chartlefttop_agencyview") {numStates=26;}
    //Parsing data to be in an Array object	
    filterData = JSON.parse(JSON.parse(filterData).data)
    var filteredStateNames = ['StateNames'];

    //Getting the selected items list
    for (j = 0; j < filterData.length; j++) {
        if (chartId == "chartlefttop")
        { filteredStateNames.push(filterData[j].State_Name); }
        else //if (chartId == "chartlefttop_agency")
        { filteredStateNames.push(filterData[j].Agency); }
	    
	}
    filteredStateNames = filteredStateNames.unique();

    //Getting opportunities for the selected list of states or agencies
    var filteredOpportunities = ['Opportunities'];
    //If All is selected, then entire data is pushed
    if (filteredStateNames.includes("All")) {
        filteredOpportunities = opportunitiesData;
        filteredStateNames = stateNamesData;
    }
    else {
        //Number of states calculated and corresponding opportunities is pushed
        numStates = filteredStateNames.length - 1;
        for (i = 1; i <= numStates; i++) {
            filteredOpportunities.push(opportunitiesData[stateNamesData.indexOf(filteredStateNames[i])]);
        }
    }

    //Calculating the height of the inner div in which chart is placed 
    var innerChartHeight;
    if (chartId == "chartlefttop")
    { innerChartHeight = numStates * 21; }
    else //if (chartId == "chartlefttop_agency")
    { innerChartHeight = numStates * 19; }
    if (innerChartHeight < 400)
    { innerChartHeight = 400; }

    document.getElementById(chartId).style.height = innerChartHeight.toString() + "px";

    //Generating chart
    var chart = c3.generate({
        bindto: "#" + chartId,
        data: {
            x: 'StateNames',
            columns: [
                filteredStateNames,
                filteredOpportunities

            ],
            type: 'bar',
            labels: true
        },
        padding: {
            bottom: 10,
            left: 70
        },
        axis: {

            x: {
                type: 'category',
                label: {
                    text: 'State Names',
                    position: 'outer-middle'
                }
            },
            y: {
                label: {
                    text: 'Opportunities',
                    position: 'outer-center'
                }
            },
            rotated: true
        },
        point: {
            show: true
        },
        bar: {
            width: {
                ratio: 0.8 // this makes bar width 50% of length between ticks
            }
        },
        legend:
        { show: false }
    });
}



//Function attached with the state view
function secondfunction() {
	
	
	//initialising the variables to be plotted in state vs oppurtunity chart
    var opportunitiesData = ['Opportunities'];
    var stateNamesData = ['StateNames'];
	
	//loader
    document.getElementById('mid-table-loader').style.opacity = '0';
    document.getElementById('agency-state-name-content').style.opacity = '1';
	
	//variables with all dropdown items
    var globalUtility = [];
    var globalAgency = [];
    var globalState = [];
    var globalData = [];
    var globalContract = [];
    var globalSolar = [];
    var globalEmgen = [];
    var globalBattery = [];
    var globalCogen = [];
    var globalFuel = [];
    var globalStage = [];
    var globalStage3 = [];
    var globalEnergy = [];
    var globalRenewable = [];
    var globalCustomer = [];
    var globalchartdata = []






    document.getElementById("cancelButton").addEventListener("click", cancelfilters);
    document.getElementById("applyButton").addEventListener("click", confirmFilters);
    document.getElementById("agencyName").items = dropdownitems;
    document.getElementById("agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    document.getElementById("stateName").items = dropdownitems_2;
    document.getElementById("state").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    document.getElementById("utilityName").items = dropdownitems_3;
    document.getElementById("utility").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
    // document.getElementById("dataGrade").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalData.push(dropDownnames[i].val)
    //         }
    // document.getElementById("data").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "UESC" }]
    // document.getElementById("contractingValue").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalContract.push(dropDownnames[i].val)
    //         }
    // document.getElementById("contract").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
    // document.getElementById("currentCustomer").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalCustomer.push(dropDownnames[i].val)
    //         }
    // document.getElementById("customer").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("solarFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalSolar.push(dropDownnames[i].val)
    //         }
    // document.getElementById("solar").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("batteryFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalBattery.push(dropDownnames[i].val)
    //         }
    // document.getElementById("battery").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("cogenFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalCogen.push(dropDownnames[i].val)
    //         }
    // document.getElementById("cogen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("emgenFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalEmgen.push(dropDownnames[i].val)
    //         }
    // document.getElementById("emgen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("fuelcellFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalFuel.push(dropDownnames[i].val)
    //         }
    // document.getElementById("fuelcell").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    // document.getElementById("stageemissionName").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalStage.push(dropDownnames[i].val)
    //         }
    // document.getElementById("stageemission").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
    // document.getElementById("stage3emissionName").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalStage3.push(dropDownnames[i].val)
    //         }
    // document.getElementById("stage3").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    // document.getElementById("energyIntensity").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalEnergy.push(dropDownnames[i].val)
    //         }
    // document.getElementById("energy").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
    // document.getElementById("renewableEnergy").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalRenewable.push(dropDownnames[i].val)
    //         }
    // document.getElementById("renewable").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    var dropdownitems = [];
    var dropdownitems_2 = [];
    var dropdownitems_3 = [];


// function triggered each time dropdown values are changed
//same function for all dropdowns
//gets the selected items into a variable and all the items as selected variables if 'All'
    function filterdrop() {
        console.log("changed filter value");


        var agency = document.getElementById("agencyName").items
        selectedAgency = []
        for (i = 0; i < agency.length; i++) {
            if (agency[i].checked != undefined && agency[i].checked != false) {
                if (agency[0].checked == true) {
                    selectedAgency = globalAgency;
                    agency[i].checked = true
                }
                else {
                    selectedAgency.push(agency[i].val);
                }
            }
        }
        var state = document.getElementById("stateName").items
        selectedState = []
        for (i = 0; i < state.length; i++) {
            if (state[i].checked != undefined && state[i].checked != false) {
                if (state[0].checked == true) {
                    selectedState = globalState;
                    state[i].checked = true
                }
                else {
                    selectedState.push(state[i].val);
                }

            }

        }
        var utility = document.getElementById("utilityName").items
        selectedUtility = []
        for (i = 0; i < utility.length; i++) {
            if (utility[i].checked != undefined && utility[i].checked != false) {
                if (utility[0].checked == true) {
                    selectedUtility = globalUtility;
                    utility[i].checked = true
                }
                else {
                    selectedUtility.push(utility[i].val);
                }

            }

        }


        var dataGrade = document.getElementById("dataGrade").items
        selectedData = []
        for (i = 0; i < dataGrade.length; i++) {
            if (dataGrade[i].checked != undefined && dataGrade[i].checked != false) {
                if (dataGrade[0].checked == true) {
                    selectedData = globalData;
                    dataGrade[i].checked = true
                } else {
                    selectedData.push(dataGrade[i].val);
                }
            }

        }
        console.log(selectedData);

        var contract = document.getElementById("contractingValue").items
        selectedContract = []
        for (i = 0; i < contract.length; i++) {
            if (contract[i].checked != undefined && contract[i].checked != false) {
                if (contract[0].checked == true) {
                    selectedContract = globalContract;
                    contract[i].checked = true
                } else {
                    selectedContract.push(contract[i].val);
                }
            }
        }
        var customer = document.getElementById("currentCustomer").items
        selectedCustomer = []
        for (i = 0; i < customer.length; i++) {
            if (customer[i].checked != undefined && customer[i].checked != false) {
                if (customer[0].checked == true) {
                    selectedCustomer = globalCustomer;
                    customer[i].checked = true
                } else {
                    selectedCustomer.push(customer[i].val);
                }
            }
        }
        var solar = document.getElementById("solarFlag").items
        selectedSolar = []
        for (i = 0; i < solar.length; i++) {
            if (solar[i].checked != undefined && solar[i].checked != false) {
                if (solar[0].checked == true) {
                    selectedSolar = globalSolar;
                    solar[i].checked = true
                } else {
                    selectedSolar.push(solar[i].val);
                }
            }

        }
        var emgen = document.getElementById("emgenFlag").items
        selectedEmgen = []
        for (i = 0; i < emgen.length; i++) {
            if (emgen[i].checked != undefined && emgen[i].checked != false) {
                if (emgen[0].checked == true) {
                    selectedEmgen = globalEmgen;
                    emgen[i].checked = true
                } else {
                    selectedEmgen.push(emgen[i].val);
                }
            }
        }
        var battery = document.getElementById("batteryFlag").items
        selectedBattery = []
        for (i = 0; i < battery.length; i++) {
            if (battery[i].checked != undefined && battery[i].checked != false) {
                if (battery[0].checked == true) {
                    selectedBattery = globalBattery;
                    battery[i].checked = true
                } else {
                    selectedBattery.push(solar[i].val);
                }
            }

        }
        var cogen = document.getElementById("cogenFlag").items
        selectedCogen = []
        for (i = 0; i < cogen.length; i++) {
            if (cogen[i].checked != undefined && cogen[i].checked != false) {
                if (cogen[0].checked == true) {
                    selectedCogen = globalCogen;
                    cogen[i].checked = true
                } else {
                    selectedCogen.push(cogen[i].val);

                }

            }
        }
        var fuelcell = document.getElementById("fuelcellFlag").items
        selectedFuel = []

        for (i = 0; i < fuelcell.length; i++) {
            if (fuelcell[i].checked != undefined && fuelcell[i].checked != false) {
                if (fuelcell[0].checked == true) {
                    selectedFuel = globalFuel;
                    fuelcell[i].checked = true
                } else {
                    selectedFuel.push(fuelcell[i].val);

                }
            }
        }
        var stageemission = document.getElementById("stageemissionName").items
        selectedStage = []
        for (i = 0; i < stageemission.length; i++) {
            if (stageemission[i].checked != undefined && stageemission[i].checked != false) {
                if (battery[0].checked == true) {
                    selectedStage = globalStage;
                    stageemission[i].checked = true
                } else {
                    selectedStage.push(stageemission[i].val);

                }
            }
        }
        var stage3 = document.getElementById("stage3emissionName").items
        selectedStage3 = []
        for (i = 0; i < stage3.length; i++) {
            if (stage3[i].checked != undefined && stage3[i].checked != false) {
                if (stage3[0].checked == true) {
                    selectedStage3 = globalStage3;
                    stage3[i].checked = true
                } else {
                    selectedStage3.push(stage3[i].val);
                }
            }

        }
        var energy = document.getElementById("energyIntensity").items
        selectedEnergy = []
        for (i = 0; i < energy.length; i++) {
            if (energy[i].checked != undefined && energy[i].checked != false) {
                if (energy[0].checked == true) {
                    selectedEnergy = globalEnergy;
                    energy[i].checked = true
                } else {
                    selectedEnergy.push(energy[i].val);
                }
            }
        }
        var renewable = document.getElementById("renewableEnergy").items
        selectedRenewable = []
        for (i = 0; i < renewable.length; i++) {
            if (renewable[i].checked != undefined && renewable[i].checked != false) {
                if (renewable[0].checked == true) {
                    selectedRenewable = globalRenewable;
                    renewable[i].checked = true
                } else {
                    selectedRenewable.push(renewable[i].val);
                }
            }
        }
        console.log(selectedRenewable);
        console.log(selectedContract);


    }


// Initialising values to all dropdowns  
//not for state , agency and utility as it comes from data on load

    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
    document.getElementById("dataGrade").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalData.push(dropDownnames[i].val)
    }
    document.getElementById("data").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "UESC" }]
    document.getElementById("contractingValue").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalContract.push(dropDownnames[i].val)
    }
    document.getElementById("contract").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
    document.getElementById("currentCustomer").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalCustomer.push(dropDownnames[i].val)
    }
    document.getElementById("customer").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("solarFlag").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalSolar.push(dropDownnames[i].val)
    }
    document.getElementById("solar").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("batteryFlag").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalBattery.push(dropDownnames[i].val)
    }
    document.getElementById("battery").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("cogenFlag").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalCogen.push(dropDownnames[i].val)
    }
    document.getElementById("cogen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("emgenFlag").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalEmgen.push(dropDownnames[i].val)
    }
    document.getElementById("emgen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("fuelcellFlag").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalFuel.push(dropDownnames[i].val)
    }
    document.getElementById("fuelcell").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    document.getElementById("stageemissionName").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalStage.push(dropDownnames[i].val)
    }
    document.getElementById("stageemission").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }]
    document.getElementById("stage3emissionName").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalStage3.push(dropDownnames[i].val)
    }
    document.getElementById("stage3").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    document.getElementById("energyIntensity").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalEnergy.push(dropDownnames[i].val)
    }
    document.getElementById("energy").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }]
    document.getElementById("renewableEnergy").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalRenewable.push(dropDownnames[i].val)
    }
    document.getElementById("renewable").addEventListener("px-dropdown-checkbox-changed", filterdrop);


//it gives popup on mouse hover on markers
    function onMouseMove(browserEvent) {
        overlay.setPosition(undefined);
        content = document.getElementById('popup-content');
        var coordinate = browserEvent.coordinate;
        var pixel = map21.getPixelFromCoordinate(coordinate);
        /*         var el = document.getElementById('name');
                el.innerHTML = ''; */
        map21.forEachFeatureAtPixel(pixel, function (feature) {
            console.log("hello")
            console.log(feature.getGeometry().A[0])

            content.innerHTML = '<p>You clicked here:</p><code>' + feature.getGeometry().A[0] +
                '</code>';
            overlay.setPosition(coordinate);
        });
        var pixel = map21.getPixelFromCoordinate(coordinate);
        /*         var el = document.getElementById('name');
                el.innerHTML = ''; */


    }


    console.log("in it");

	
	//function that runs on click of apply
	//gets filtered data based on the filtered values
    function confirmFilters() {


        var request = new XMLHttpRequest();
        var datapointsUrl = "/DataTableFiltered";
        request.open('POST', datapointsUrl, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function (response) {
            if (request.status >= 200 && request.status < 400) {
                document.getElementById('mid-table-loader').style.opacity = '0';
                document.getElementById('agency-state-name-content').style.opacity = '1';

                getdropdowns(request.response);
                drawTable(request.response);
                createMarkers(request.response);
                drawChartLeftTop(request.response, opportunitiesData, stateNamesData, "chartlefttop");

            } else {
                console.log("failure on status code");
            }


        };
        request.onerror = function () {
            console.log("failure after success code");
        };

        if (selectedAgency == "") {
            selectedAgency = globalAgency
        }

        if (selectedState == "") {
            selectedState = globalState
        }
        if (selectedUtility == "") {
            selectedUtility = globalUtility
        }
        if (selectedCustomer == "") {
            selectedCustomer = globalCustomer
        }

        if (selectedSolar == "") {
            selectedSolar = globalSolar
        }
        if (selectedStage == "") {
            selectedStage = globalStage
        }
        if (selectedStage3 == "") {
            selectedStage3 = globalStage3
        }

        if (selectedRenewable == "") {
            selectedRenewable = globalRenewable
        }
        if (selectedBattery == "") {
            selectedBattery = globalBattery
        }
        if (selectedFuel == "") {
            selectedFuel = globalFuel
        }

        if (selectedEmgen == "") {
            selectedEmgen = globalEmgen
        }
        if (selectedCogen == "") {
            selectedCogen = globalCogen
        }
        if (selectedContract == "") {
            selectedContract = globalContract
        }

        if (selectedData == "") {
            selectedData = globalData
        }
        if (selectedEnergy == "") {
            selectedEnergy = globalEnergy
        }

		var selectedStartftvalue = document.getElementById("grossSqft").value;
	    var selectedEndftvalue = document.getElementById("grossSqft").endValue;


          var requestData = {
            "agency": selectedAgency, "state": selectedState, "utility": selectedUtility,
            "customer": selectedCustomer,"startftvalue": selectedStartftvalue, "endftvalue": selectedEndftvalue, "contract": selectedContract, "battery": selectedBattery, "emgen": selectedEmgen,
            "cogen": selectedCogen, "fuelcell": selectedFuel, "renewable": selectedRenewable, "solar": selectedSolar,
            "stage": selectedStage, "stage3": selectedStage3, "data": selectedData, "energy": selectedEnergy
        };
        document.getElementById('mid-table-loader').style.opacity = '1';
        document.getElementById('agency-state-name-content').style.opacity = '0.2';
        request.send(JSON.stringify(requestData));
    };

	
	//function that populates the facility name and building name on top of the middle table
	//Also the no. of opportunities is calculated
    function getdropdowns(data) {
        data = JSON.parse(JSON.parse(data).data);
        var dropdownitems = [];
        var dropdownitems_2 = [];
        for (i = 0; i < data.length; i++) {
            dropdownitems.push(data[i].Facility_Name)
            dropdownitems_2.push(data[i].Building_Name)
        }

        dropdownitems = uniq_fast(dropdownitems)
        dropdownitems_2 = uniq_fast(dropdownitems_2)

        console.log(dropdownitems)
        document.getElementById("facilityName").items = dropdownitems;
        document.getElementById("buildingName").items = dropdownitems_2;
        /*  document.getElementById("facilityName_State").items = dropdownitems;
        document.getElementById("buildingName_State").items = dropdownitems_2; */

        document.getElementById("noOppurtunity").innerHTML = data.length;
    }

	//Creates the markers on the map from the latlon data 
	//Markers are also styled agency wisehere 
    function createMarkers(data) {
        //data = JSON.parse(data)
        var colorsused = ["#4286f4", "#f441eb", "#f4414f", "#41aff4", "#49f441", "#ebf441", "#f4a041", "#d0f441", "#ff0080", "#ff0000", "#808080", "#bd6769", "#bdef69", "#d18bfe", "#10176f", "#660000", "#4286f4", "#f441eb", "#f4414f", "#41aff4", "#49f441", "#ebf441", "#f4a041", "#d0f441", "#ff0080", "#ff0000", "#808080", "#bd6769", "#bdef69"]
        var lngfirst;
        var latfirst;
        var array = [];
        data = JSON.parse(JSON.parse(data).data);

        lngfirst = -85.41;
        latfirst = 38.82;
        latlong = data;
        console.log(latlong)

        for (var i = 0; i < data.length; i++) {

            if (parseInt(data[i].Longitude) && parseInt(data[i].Latitude)) {
                lngfirst = data[i].Longitude
                latfirst = data[i].Latitude
                break;
            }
            else {
                lngfirst = -85.41;
                latfirst = -85.41;
            }
        }

        for (var i = 0; i < data.length; i++) {




            if (parseInt(data[i].Longitude)) {

                lng = parseInt(data[i].Longitude)
                lat = parseInt(data[i].Latitude)


                var x = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
                });

                for (var j = 0; j < globalAgency.length; j++) {
                    bla = colorsused[j]
                    if (data[i].Agency == globalAgency[j]) {
                        x.setStyle(new ol.style.Style({
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                                color: bla,
                                scale: '0.4',
                                crossOrigin: 'anonymous',
                                src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
                            }))
                        }));

                    }


                }
                array.push(x)
            }


        }

        console.log(lng)
        console.log(array)


        var vectorSource = new ol.source.Vector({
            features: array
        });
        vectorLayer.getSource().clear()
        vectorLayer.setSource(vectorSource)
        /*       vectorLayer = new ol.layer.Vector({
                source: vectorSource
              }); */

        var rasterLayer = new ol.layer.Tile({
            source: new ol.source.TileJSON({
            url: 'https://api.mapbox.com/v4/mapbox.streets-basic.json?access_token=pk.eyJ1Ijoic2VhcmNoaW5nYWtrdSIsImEiOiJjajVrdnVrZ3QybncxMnFvNnZwOXdnNzR3In0.TwSykj2VNdmMWko458WTmQ',
                crossOrigin: ''
            })
        });

        console.log(lngfirst)
        console.log(latfirst)
        lngfirst = parseFloat(lngfirst)
        latfirst = parseFloat(latfirst)
        console.log(lngfirst)
        console.log(latfirst)
        /* lngfirst = lngfirst.toPrecision(2);
        latfirst = latfirst.toPrecision(2); */
        console.log(lngfirst)
        console.log(latfirst)
        lngfirst = parseFloat(lngfirst)
        latfirst = parseFloat(latfirst)
        View = map21.getView()
        console.log(View)
        View.setCenter(ol.proj.transform([lngfirst, latfirst], 'EPSG:4326', 'EPSG:3857'))
        View.setZoom(5)

    }
    
	
	
	//Function that executes once the cancel button is clicked
	//It clears checks from dropdowns
    function cancelfilters() {
        console.log('Goin to clear ALL')
        var agency = document.getElementById("agencyName").items
        for (i = 0; i < agency.length; i++) {
            agency[i].checked = false
        }

        var state = document.getElementById("stateName").items
        for (i = 0; i < state.length; i++) {
            state[i].checked = false
        }

        var utility = document.getElementById("utilityName").items
        for (i = 0; i < utility.length; i++) {
            utility[i].checked = false
        }


        var dataGrade = document.getElementById("dataGrade").items
        for (i = 0; i < agency.length; i++) {
            agency[i].checked = false
        }

        var contract = document.getElementById("contractingValue").items
        for (i = 0; i < contract.length; i++) {
            contract[i].checked = false
        }

        var customer = document.getElementById("currentCustomer").items
        for (i = 0; i < customer.length; i++) {
            customer[i].checked = false
        }

        var solar = document.getElementById("solarFlag").items
        for (i = 0; i < solar.length; i++) {
            solar[i].checked = false
        }

        var emgen = document.getElementById("emgenFlag").items
        for (i = 0; i < emgen.length; i++) {
            emgen[i].checked = false
        }

    }


	//request to get data to populate data in the middle table in overview tab
    makeRequest('GET', '/DataTable', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        drawTable(data)

        // for (i = 0; i < result_data.length; i++) {
        //     dropdownitems.push(result_data[i].Facility_Name)
        //     dropdownitems_2.push(result_data[i].Building_Name)
        // }

        // dropdownitems = uniq_fast(dropdownitems)
        // dropdownitems_2 = uniq_fast(dropdownitems_2)

        // console.log(dropdownitems)
        // document.getElementById("facilityName").items = dropdownitems;
        // document.getElementById("buildingName").items = dropdownitems_2;





    }
    );




//request to get data for the state vs opportunities graph
    makeRequest('GET', '/chartTable', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        globalchartdata = result_data;

        for (i = 0; i < result_data.length; i++) {
            stateNamesData.push(result_data[i].State_Name)
            opportunitiesData.push(parseInt(result_data[i].Opportunities))
        }
        console.log(stateNamesData)
        console.log(opportunitiesData)
        /*dropdownitems=uniq_fast(dropdownitems) 
        dropdownitems_2=uniq_fast(dropdownitems_2)
        
        console.log(dropdownitems)
        document.getElementById("facilityName").items=dropdownitems; 
        document.getElementById("buildingName").items=dropdownitems_2; 
         */
        //var s1tateNamesData=["StateNames","a","b","c"]
        //var o1pportunitiesData=["Opportunities",10,20,15]
        var chart = c3.generate({
            bindto: "#chartlefttop",
            data: {
                x: 'StateNames',
                columns: [
                    stateNamesData,
                    opportunitiesData

                ],
                //url: '/chartData',
                type: 'bar',
                labels: true
            },
            padding: {
                bottom: 10,
                left: 70
            },
            axis: {

                x: {
                    type: 'category',
                    label: {
                        text: 'State Names',
                        position: 'outer-middle'
                    }
                },
                y: {
                    label: {
                        text: 'Opportunities',
                        position: 'outer-center'
                    }
                },
                rotated: true
            },
            point: {
                show: true
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //dth: 100 // this makes bar width 100px
            },
            legend:
            { show: false }
        });

    });

	//request to get data for the agency,state, utility names for overview
    makeRequest('GET', '/AllData', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        dropdownitems = ['All'];
        dropdownitems_2 = ['All'];
        dropdownitems_3 = ['All'];
        for (i = 0; i < result_data.length; i++) {
            dropdownitems.push(result_data[i].Agency)



            dropdownitems_2.push(result_data[i].State_Name)


            dropdownitems_3.push(result_data[i].Utility_Partner)


        }
        dropdownitems = uniq_fast(dropdownitems)

        for (i = 1; i < dropdownitems.length; i++) {
            globalAgency.push(dropdownitems[i].val)
        }


        dropdownitems_2 = uniq_fast(dropdownitems_2)

        for (i = 1; i < dropdownitems_2.length; i++) {
            globalState.push(dropdownitems_2[i].val)
        }


        dropdownitems_3 = uniq_fast(dropdownitems_3)
        for (i = 1; i < dropdownitems_3.length; i++) {
            globalUtility.push(dropdownitems_3[i].val)
        }

        console.log(dropdownitems)
        document.getElementById("agencyName").items = dropdownitems;
        document.getElementById("agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
        document.getElementById("stateName").items = dropdownitems_2;
        document.getElementById("state").addEventListener("px-dropdown-checkbox-changed", filterdrop);
        document.getElementById("utilityName").items = dropdownitems_3;
        document.getElementById("utility").addEventListener("px-dropdown-checkbox-changed", filterdrop);


    }
    );
    // makeRequest('GET', '/DataTable', function(err, data) {
    //     console.log("success");
    //                 console.log(data)
    //                 result_data=JSON.parse(data)
    //                 result_data=JSON.parse(result_data.data)
    //                 drawTable(data)
    //   }
    // );







// two markers are created in the map
//This is to get the markers in the local

    var rome = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-80.41, 28.82]))
    });

    var london = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-85.41, 38.82]))
    });

    /*       var madrid = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
      }); */

    rome.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            color: '#8959A8',
            scale: '0.4',
            crossOrigin: 'anonymous',
            src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
    }));

    london.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            color: '#4271AE',
            scale: '0.4',
            crossOrigin: 'anonymous',
            src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
    }));

    /*       madrid.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ /*({
color: [113, 140, 0],
crossOrigin: 'anonymous',
src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
}))
})); */


    var vectorSource = new ol.source.Vector({
        features: [rome, london]
    });

    vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'https://api.mapbox.com/v4/mapbox.streets-basic.json?access_token=pk.eyJ1Ijoic2VhcmNoaW5nYWtrdSIsImEiOiJjajVrdnVrZ3QybncxMnFvNnZwOXdnNzR3In0.TwSykj2VNdmMWko458WTmQ',
            crossOrigin: ''
        })
    });






    container = document.getElementById('popup')

    overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));

	//get the map with two markers even in local
    map21 = new ol.Map({
        layers: [rasterLayer, vectorLayer],
        overlays: [overlay],
        target: document.getElementById('map2'),
        view: new ol.View({
            center: ol.proj.fromLonLat([-70.41, 18.82]),
            zoom: 3
        })
    });

    map21.on('pointermove', onMouseMove);

    closer = document.getElementById('popup-closer')

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };


	
	//request to get latlon data and plot the map during the initial load
    makeRequest('GET', '/LongLat', function (err, data) {



        var data = data
        createMarkers(data)
    }
    );








    /*    }); */




}

//Function to populate Building info tab 2 by requesting data based on  building selection
function buildingMoreInfo(maxTotScore,facilityTotScore){
	
	 var scoresData = ['Scores'];
	 var percentileData = ['Percentile Value'];
	 
	
	 var scoreType='Total_Mu_Sigma_Score'
	 document.getElementById("scorevspercentile").addEventListener("px-dropdown-value-changed",function(evt){
		scoreType = evt.detail.key
		scoresData = ['Scores'];
		percentileData = ['Percentile Value'];
	 
		makeRequest('GET', '/scorePercentileGraph/'+scoreType, function (err, data) {
			result_data=JSON.parse(data)
            result_data=JSON.parse(result_data.data)
            
			if(scoreType == 'Total_Mu_Sigma_Score')
				{
				for(i=0;i<result_data.length;i++)
					{
					scoresData.push(result_data[i].Total_Mu_Sigma_Score);
					percentileData.push(result_data[i].cume_dist);
					}
				}
			else if(scoreType == 'Site_Area_Score')
				{
				for(i=0;i<result_data.length;i++)
					{
					scoresData.push(result_data[i].Site_Area_Score);
					percentileData.push(result_data[i].cume_dist);
					}
				}
			else if(scoreType == 'Energy_Profile_Score')
				{
				for(i=0;i<result_data.length;i++)
					{
					scoresData.push(result_data[i].Energy_Profile_Score);
					percentileData.push(result_data[i].cume_dist);
					}
				}
			else if(scoreType == 'Energy_Consumption_Score')
				{
				for(i=0;i<result_data.length;i++)
					{
					scoresData.push(result_data[i].Energy_Consumption_Score);
					percentileData.push(result_data[i].cume_dist);
					}
				}
			else if(scoreType == 'Energy_Intensity_Score')
				{
				for(i=0;i<result_data.length;i++)
					{
					scoresData.push(result_data[i].Energy_Intensity_Score);
					percentileData.push(result_data[i].cume_dist);
					}
				}
	var chart = c3.generate({
		bindto: "#svpgraph",
    data: {
		x:'Scores',
        columns: [
            scoresData,
            percentileData
        ],
        type: 'spline'
		},
	axis: {
          x: {
             label: {
                    text: scoreType,
                    position: 'outer-middle'
                    }
             },
          y: {
             label: {
                    text: 'Percentile',
                    position: 'outer-center'
                    }
             }
		},
	legend: {
        show: false
		}
	});
	});
	 });
	 
	 makeRequest('GET', '/scorePercentileGraph/'+scoreType, function (err, data) {
			result_data=JSON.parse(data)
            result_data=JSON.parse(result_data.data)
            
			for(i=0;i<result_data.length;i++)
				{
				scoresData.push(result_data[i].Total_Mu_Sigma_Score);
				percentileData.push(result_data[i].cume_dist);
				}
		
	var chart = c3.generate({
		bindto: "#svpgraph",
    data: {
		x:'Scores',
        columns: [
            scoresData,
            percentileData
        ],
        type: 'spline'
		},
	axis: {
          x: {
             label: {
                    text: scoreType,
                    position: 'outer-middle'
                    }
             },
          y: {
             label: {
                    text: 'Percentile',
                    position: 'outer-center'
                    }
             }
		},
	legend: {
        show: false
		}
	});
	});
		console.log("flag0")
		if(buildingMIStarted==0)
		{
			buildingMIStarted=1;
		makeRequest('GET', '/BuildingMoreInfoMaxMed', function (err, data) {
			result_data=JSON.parse(data)
            result_data=JSON.parse(result_data.data)
            
          //maximum 
			document.getElementById("max-is").innerHTML = result_data[0].max_eis
			document.getElementById("max-us").innerHTML = result_data[0].max_ecs
			document.getElementById("max-sfs").innerHTML = result_data[0].max_sas
			document.getElementById("max-nb").innerHTML = result_data[0].max_nb
			document.getElementById("max-bme").innerHTML = result_data[0].max_bme
			document.getElementById("max-sf").innerHTML = result_data[0].max_ssf
			document.getElementById("max-ts").innerHTML = result_data[0].max_ts
			document.getElementById("max-aeu").innerHTML = result_data[0].max_aec
			document.getElementById("max-ei").innerHTML = result_data[0].max_ei
			document.getElementById("max-pl").innerHTML = result_data[0].max_pl
			document.getElementById("max-aes").innerHTML = result_data[0].max_aes
			document.getElementById("max-tsdp").innerHTML = result_data[0].max_tsdp
		//median
			document.getElementById("med-is").innerHTML = result_data[0].med_eis
			document.getElementById("med-ts").innerHTML = result_data[0].med_ts
			document.getElementById("med-us").innerHTML = result_data[0].med_ecs
			document.getElementById("med-sfs").innerHTML = result_data[0].med_sas
			document.getElementById("med-nb").innerHTML = result_data[0].med_nb
			document.getElementById("med-bme").innerHTML = result_data[0].med_bme
			document.getElementById("med-sf").innerHTML = result_data[0].med_ssf
			document.getElementById("med-aeu").innerHTML = result_data[0].med_aec
			document.getElementById("med-ei").innerHTML = result_data[0].med_ei
			document.getElementById("med-pl").innerHTML = result_data[0].med_pl
			document.getElementById("med-aes").innerHTML = result_data[0].med_aes
			//document.getElementById("med-tsdp").innerHTML = result_data[0].med_tsdp
			});
		}	/*makeRequest('GET', '/buildingInf/'+buildingName, function(err, data) {*/
		makeRequest('GET', '/BuildingMoreInfoBdngLevel/'+buildingName, function (err, data) {
			result_data=JSON.parse(data)
            result_data=JSON.parse(result_data.data)
            
			document.getElementById("agency-name-mi1").innerHTML = result_data[0].Agency
			document.getElementById("facility-name-mi").innerHTML = result_data[0].Facility_Name
			document.getElementById("building-name-mi").innerHTML = result_data[0].Building_Name
			document.getElementById("state-name-mi").innerHTML = result_data[0].State_Name
	 
			document.getElementById("address").innerHTML = result_data[0].Address
			document.getElementById("fv-aes").innerHTML = result_data[0].Annual_Energy_Spending_Comm
			document.getElementById("fv-aeu").innerHTML = result_data[0].Annual_Energy_Consumption_Mbtu
			document.getElementById("fv-ei").innerHTML = result_data[0].Annual_Energy_Use_Intensity_Kbtu_per_Sq_Ft
			document.getElementById("poc").innerHTML = result_data[0].Contact_Name
			document.getElementById("contact").innerHTML = result_data[0].Contact_Number
			document.getElementById("exeloncust").innerHTML = result_data[0].Current_Customer
			document.getElementById("fv-tsdp").innerHTML = result_data[0].Data_added_on
			document.getElementById("fv-us").innerHTML = result_data[0].Energy_Consumption_Score
			document.getElementById("fv-is").innerHTML = result_data[0].Energy_Intensity_Score
			document.getElementById("intdata").innerHTML = result_data[0].Interval_data_availability
			document.getElementById("fv-bme").innerHTML = result_data[0].Number_Of_Buildings_Metered_For_Electricity
			document.getElementById("fv-nb").innerHTML = result_data[0].Number_of_Buildings
			document.getElementById("fv-pl").innerHTML = result_data[0].Peak_kW
			document.getElementById("uesc-espc").innerHTML = result_data[0].Possible_Contracting_Vehicle
			document.getElementById("fv-sfs").innerHTML = result_data[0].Site_Area_Score
			document.getElementById("fv-sf").innerHTML = result_data[0].Site_Sq_ft
			document.getElementById("fv-ts").innerHTML = result_data[0].Total_Mu_Sigma_Score
			document.getElementById("utility").innerHTML = result_data[0].Utility_Partner
			});
	 
		
}


//Function to draw circles in the building info tab 1
function buildingInfCircles() {
    dataJson = [{ "id": "circle12ghg", "cx": 100, "label": "Stage 1&2 GHG Emissions" }, { "id": "circle3ghg", "cx": 300, "label": "Stage 3 GHG Emissions" }, { "id": "circlereduction", "cx": 500, "label": "Reduction in Energy Intensity" }, { "id": "circleusage", "cx": 700, "label": "Usage of Renewable Energy" }]
    var svg_container = d3.select("#circles_bottomright")
        .append("svg")
        .style("width", "100%")
        .attr("viewBox", "0 0 800 200")
        .attr("perserveAspectRatio", "xMinYMid");
    var circles = svg_container.selectAll("circle")
        .data(dataJson)
        .enter()
        .append("circle");
    var circle_attributes = circles.attr("cx", function (d) { return d.cx; })
        .attr("id", function (d) { return d.id; })
        .attr("cy", 60)
        .attr("r", 40);
    var text = svg_container.selectAll("text")
        .data(dataJson)
        .enter()
        .append("text");
    var textLabels = text.attr("x", function (d) { return d.cx - 70; })
        .attr("y", 120)
        .text(function (d) { return d.label; });
}

//Function to populate building info tab 1 based on building name selection
function buildingInf() {
    console.log(buildingName)
    //window.location.href = "/#/overview"
    d3.select("#moreinfolink").on("click", function () { window.location.assign("/#/buildingmoreinfo"); })
    var facilityScore = ['Score on selected facility'];
    var flagArray = [];
    var batteryColor = "grey", coGenColor = "grey", emGenColor = "grey", fuelCellColor = "grey", solarColor = "grey";
    var aName = " ", fName = " ", bName = " ", sName = " ", pReason = " ", sReason = " ";
    var maxScoreArray = ['Maximum Score on selected category'];
    $(document).ready(function () {
        //document.location.assign("/#/overview")
        // '/DataTableFiltered/'+selectedAgency
        makeRequest('GET', '/buildingInfMaxScores', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            result_data = JSON.parse(result_data.data)
            console.log(result_data)
            maxScoreArray.push(result_data[0].score1)
            maxScoreArray.push(result_data[0].score2)
            maxScoreArray.push(result_data[0].score3)
            maxScoreArray.push(result_data[0].score4)
            makeRequest('GET', '/buildingInf/' + buildingName, function (err, data) {
                console.log("success");
                console.log(data)
                result_data = JSON.parse(data)
                result_data = JSON.parse(result_data.data)
                console.log(result_data)

                facilityScore.push(result_data[0].Total_Mu_Sigma_Score)
                facilityScore.push(result_data[0].PTA_Score)
                facilityScore.push(result_data[0].Energy_Profile_Score)
                facilityScore.push(result_data[0].Potential_DE_Score)

                flagArray.push(result_data[0].Stage_1_2_GHG_emissions)
                flagArray.push(result_data[0].Stage_3_GHG_emissions)
                flagArray.push(result_data[0].Reduction_in_Energy_Intensity)
                flagArray.push(result_data[0].Usage_of_renewable_energy)

                for (i = 0; i < 4; i++) {
                    //dataJson[i].flag=flagArray[i];
                    if (flagArray[i] == null) { flagArray[i] = "grey" }
                }
                d3.select("#circle12ghg").attr("fill", flagArray[0])
                d3.select("#circle3ghg").attr("fill", flagArray[1])
                d3.select("#circlereduction").attr("fill", flagArray[2])
                d3.select("#circleusage").attr("fill", flagArray[3])

                if (result_data[0].Battery_Flag == 0) { batteryColor = "red" } else if (result_data[0].Battery_Flag == 1) { batteryColor = "green" }
                if (result_data[0].Cogen_Flag == 0) { coGenColor = "red" } else if (result_data[0].Cogen_Flag == 1) { coGenColor = "green" }
                if (result_data[0].Emgen_Flag == 0) { emGenColor = "red" } else if (result_data[0].Emgen_Flag == 1) { emGenColor = "green" }
                if (result_data[0].Fuelcell_Flag == 0) { fuelCellColor = "red" } else if (result_data[0].Fuelcell_Flag == 1) { fuelCellColor = "green" }
                if (result_data[0].Solar_Flag == 0) { solarColor = "red" } else if (result_data[0].Solar_Flag == 1) { solarColor = "green" }

                aName = result_data[0].Agency
                fName = result_data[0].Facility_Name
                bName = result_data[0].Building_Name
                sName = result_data[0].State_Name

                pReason = result_data[0].Reason_Code_1
                sReason = result_data[0].Reason_Code_2

                document.getElementById("batteryflag").style.color = batteryColor
                document.getElementById("cogenflag").style.color = coGenColor
                document.getElementById("emgenflag").style.color = emGenColor
                document.getElementById("fuelcellflag").style.color = fuelCellColor
                document.getElementById("solarflag").style.color = solarColor

                document.getElementById("agency-name").innerHTML = aName
                document.getElementById("facility-name").innerHTML = fName
                document.getElementById("building-name").innerHTML = bName
                document.getElementById("state-name").innerHTML = sName

                document.getElementById("ptrc").innerHTML = pReason
                document.getElementById("strc").innerHTML = sReason

                d3.select("#moreinfolink").on("click", function () {
                    window.location.assign("/#/buildingmoreinfo");
                    buildingMoreInfo(aName, fName, bName, sName, maxScoreArray[1], facilityScore[1]);
                }
                )


                var chart = c3.generate({
                    bindto: "#bar-chart-buildinfo",
                    padding: { bottom: 10 },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', "Total score(max:800)", "PTA score(max:100)", "Energy profile score(max:400)", "DE score(max:100)"],
                            //['Maximum score on selected category', 430, 200, 400, 300],
                            //['Score on selected facility', 400, 100, 340, 250]
                            maxScoreArray,
                            facilityScore
                        ],
                        type: 'bar',
                        labels: true
                    },
                    bar: {
                        width: {
                            ratio: 0.3
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                        },
                        y: { show: false }
                    }
                });

                //var dataJson = [{"cx":100,"flag":"grey","label":"Stage 1&2 GHG Emissions"},{"cx":300,"flag":"grey","label":"Stage 3 GHG Emissions"},{"cx":500,"flag":"grey","label":"Reduction in Energy Intensity"},{"cx":700,"flag":"grey","label":"Usage of Renewable Energy"}]

            });
        });
    });
}


//function attached with the state view

function statefunction() {

    console.log('great')
//initialisation for populating the Agency vs Oppurtunities 
    var opportunitiesData = ['Opportunities']
    var stateNamesData = ['StateNames']
	
	//initialise the local variables
    var globalUtility = [];
    var globalAgency = [];
    var globalState = [];
    var globalData = [];
    var globalContract = [];
    var globalSolar = [];
    var globalEmgen = [];
    var globalBattery = [];
    var globalCogen = [];
    var globalFuel = [];
    var globalStage = [];
    var globalStage3 = [];
    var globalEnergy = [];
    var globalRenewable = [];
    var globalCustomer = [];
    var globalchartdata = [];
    var regulationdata = [];

	//function to get the popups on mouse move on the map markers
    function onMouseMove_State(browserEvent) {
        overlay.setPosition(undefined);
        content = document.getElementById('popup-content');
        var coordinate = browserEvent.coordinate;
        var pixel = map31.getPixelFromCoordinate(coordinate);
        /*         var el = document.getElementById('name');
                el.innerHTML = ''; */
        map31.forEachFeatureAtPixel(pixel, function (feature) {
            console.log("hello")
            console.log(feature.getGeometry().A[0])

            content.innerHTML = '<p>You clicked here:</p><code>' + feature.getGeometry().A[0] +
                '</code>';
            overlay.setPosition(coordinate);
        });
        /*         var el = document.getElementById('name');
                el.innerHTML = ''; */


    }

	
	//function called on apply button in state function
    function confirmFilters_State() {


        var request = new XMLHttpRequest();
        var datapointsUrl = "/DataTableFiltered";
        request.open('POST', datapointsUrl, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function (response) {
            if (request.status >= 200 && request.status < 400) {
                document.getElementById('mid-table-loader').style.opacity = '0';
                document.getElementById('agency-state-name-content').style.opacity = '1';
                getdropdowns_State(request.response);
                drawTable_State(request.response);
                createMarkers(request.response);
                drawChartLeftTop(request.response, opportunitiesData, stateNamesData, "chartlefttop_agency");

            } else {
                console.log("failure on status code");
            }


        };
        request.onerror = function () {
            console.log("failure after success code");
        };

        if (selectedAgency == "") {
            selectedAgency = globalAgency
        }

        if (selectedState == "") {
            selectedState = globalState
        }
        if (selectedUtility == "") {
            selectedUtility = globalUtility
        }
        if (selectedCustomer == "") {
            selectedCustomer = globalCustomer
        }

        if (selectedSolar == "") {
            selectedSolar = globalSolar
        }
        if (selectedStage == "") {
            selectedStage = globalStage
        }
        if (selectedStage3 == "") {
            selectedStage3 = globalStage3
        }

        if (selectedRenewable == "") {
            selectedRenewable = globalRenewable
        }
        if (selectedBattery == "") {
            selectedBattery = globalBattery
        }
        if (selectedFuel == "") {
            selectedFuel = globalFuel
        }

        if (selectedEmgen == "") {
            selectedEmgen = globalEmgen
        }
        if (selectedCogen == "") {
            selectedCogen = globalCogen
        }
        if (selectedContract == "") {
            selectedContract = globalContract
        }

        if (selectedData == "") {
            selectedData = globalData
        }
        if (selectedEnergy == "") {
            selectedEnergy = globalEnergy
        }
//Variables for the slider to capture start and end values
		var selectedStartftvalue = document.getElementById("grossSqft_State").value;
	    var selectedEndftvalue = document.getElementById("grossSqft_State").endValue;

        var requestData = {
            "agency": selectedAgency, "state": selectedState, "utility": selectedUtility,
            "customer": selectedCustomer,"startftvalue": selectedStartftvalue, "endftvalue": selectedEndftvalue, "contract": selectedContract, "battery": selectedBattery, "emgen": selectedEmgen,
            "cogen": selectedCogen, "fuelcell": selectedFuel, "renewable": selectedRenewable, "solar": selectedSolar,
            "stage": selectedStage, "stage3": selectedStage3, "data": selectedData, "energy": selectedEnergy
        };
        document.getElementById('mid-table-loader').style.opacity = '1';
        document.getElementById('agency-state-name-content').style.opacity = '0.2';
        request.send(JSON.stringify(requestData));
    };



//
    function getdropdowns_State(data) {
        data = JSON.parse(JSON.parse(data).data);
        var dropdownitems = [];
        var dropdownitems_2 = [];
        for (i = 0; i < data.length; i++) {
            dropdownitems.push(data[i].Facility_Name)
            dropdownitems_2.push(data[i].Building_Name)
        }

        dropdownitems = uniq_fast(dropdownitems)
        dropdownitems_2 = uniq_fast(dropdownitems_2)

        console.log(dropdownitems)
        /*    document.getElementById("facilityName").items = dropdownitems;
           document.getElementById("buildingName").items = dropdownitems_2; */
        document.getElementById("facilityName_State").items = dropdownitems;
        document.getElementById("buildingName_State").items = dropdownitems_2;

        document.getElementById("noOppurtunity_State").innerHTML  = 	data.length; 
    }

//create markers from data 
//color coded based on agency
    function createMarkers(data) {
        //data = JSON.parse(data)
        var colorsused = ["#4286f4", "#f441eb", "#f4414f", "#41aff4", "#49f441", "#ebf441", "#f4a041", "#d0f441", "#ff0080", "#ff0000", "#808080", "#bd6769", "#bdef69", "#d18bfe", "#10176f", "#660000", "#4286f4", "#f441eb", "#f4414f", "#41aff4", "#49f441", "#ebf441", "#f4a041", "#d0f441", "#ff0080", "#ff0000", "#808080", "#bd6769", "#bdef69"]
        var lngfirst;
        var latfirst;
        var array = [];
        data = JSON.parse(JSON.parse(data).data);

        lngfirst = -85.41;
        latfirst = 38.82;
        latlong = data;
        console.log(latlong)

        for (var i = 0; i < data.length; i++) {

            if (parseInt(data[i].Longitude) && parseInt(data[i].Latitude)) {
                lngfirst = data[i].Longitude
                latfirst = data[i].Latitude
                break;
            }
            else {
                lngfirst = -85.41;
                latfirst = -85.41;
            }
        }

        for (var i = 0; i < data.length; i++) {




            if (parseInt(data[i].Longitude)) {

                lng = parseInt(data[i].Longitude)
                lat = parseInt(data[i].Latitude)


                var x = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
                });

                for (var j = 0; j < globalAgency.length; j++) {
                    bla = colorsused[j]
                    if (data[i].Agency == globalAgency[j]) {
                        x.setStyle(new ol.style.Style({
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                                color: bla,
                                scale: '0.4',
                                crossOrigin: 'anonymous',
                                src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
                            }))
                        }));

                    }


                }
                array.push(x)
            }


        }

        console.log(lng)
        console.log(array)


        var vectorSource = new ol.source.Vector({
            features: array
        });
        vectorLayer.getSource().clear()
        vectorLayer.setSource(vectorSource)
        /*       vectorLayer = new ol.layer.Vector({
                source: vectorSource
              }); */

        var rasterLayer = new ol.layer.Tile({
            source: new ol.source.TileJSON({
            url: 'https://api.mapbox.com/v4/mapbox.streets-basic.json?access_token=pk.eyJ1Ijoic2VhcmNoaW5nYWtrdSIsImEiOiJjajVrdnVrZ3QybncxMnFvNnZwOXdnNzR3In0.TwSykj2VNdmMWko458WTmQ',
                crossOrigin: ''
            })
        });

        console.log(lngfirst)
        console.log(latfirst)
        lngfirst = parseFloat(lngfirst)
        latfirst = parseFloat(latfirst)
        console.log(lngfirst)
        console.log(latfirst)
        /* lngfirst = lngfirst.toPrecision(2);
        latfirst = latfirst.toPrecision(2); */
        console.log(lngfirst)
        console.log(latfirst)
        lngfirst = parseFloat(lngfirst)
        latfirst = parseFloat(latfirst)
        View = map31.getView()
        console.log(View)
        View.setCenter(ol.proj.transform([lngfirst, latfirst], 'EPSG:4326', 'EPSG:3857'))
        View.setZoom(5)

    }


    document.getElementById("applyButton_State").addEventListener("click", confirmFilters_State);

    document.getElementById("agency_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);

    document.getElementById("state_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);

    document.getElementById("utility_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);



    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
    document.getElementById("dataGrade_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalData.push(dropDownnames[i].val)
    }
    document.getElementById("dataState_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "UESC" }]
    document.getElementById("contractingValue_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalContract.push(dropDownnames[i].val)
    }
    document.getElementById("contract_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
    document.getElementById("currentCustomer_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalCustomer.push(dropDownnames[i].val)
    }
    document.getElementById("customer_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("solarFlag_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalSolar.push(dropDownnames[i].val)
    }
    document.getElementById("solar_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("batteryFlag_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalBattery.push(dropDownnames[i].val)
    }
    document.getElementById("battery_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("cogenFlag_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalCogen.push(dropDownnames[i].val)
    }
    document.getElementById("cogen_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("emgenFlag_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalEmgen.push(dropDownnames[i].val)
    }
    document.getElementById("emgen_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("fuelcellFlag_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalFuel.push(dropDownnames[i].val)
    }
    document.getElementById("fuelcell_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    document.getElementById("stageemissionName_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalStage.push(dropDownnames[i].val)
    }
    document.getElementById("stageemission_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }]
    document.getElementById("stage3emissionName_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalStage3.push(dropDownnames[i].val)
    }
    document.getElementById("stage3_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    document.getElementById("energyIntensity_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalEnergy.push(dropDownnames[i].val)
    }
    document.getElementById("energy_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }]
    document.getElementById("renewableEnergy_State").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalRenewable.push(dropDownnames[i].val)
    }
    document.getElementById("renewable_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    var dropdownitems = [];
    var dropdownitems_2 = [];
    var dropdownitems_3 = [];

	
	//function called when any dropdown value is changed
    function filterdrop() {
        console.log("changed filter value");


        var agency = document.getElementById("agencyName_State").items
        selectedAgency = []
        for (i = 0; i < agency.length; i++) {
            if (agency[i].checked != undefined && agency[i].checked != false) {
                if (agency[0].checked == true) {
                    selectedAgency = globalAgency;
                    agency[i].checked = true
                }
                else {
                    selectedAgency.push(agency[i].val);
                }
            }
        }


        var state = document.getElementById("stateName_State").items
        selectedState = []
        for (i = 0; i < state.length; i++) {
            if (state[i].checked != undefined && state[i].checked != false) {
                if (state[0].checked == true) {
                    selectedState = globalState;
                    state[i].checked = true
                }
                else {
                    selectedState.push(state[i].val);
                }

            }

        }


        var dataGrade = document.getElementById("dataGrade_State").items
        selectedData = []
        for (i = 0; i < dataGrade.length; i++) {
            if (dataGrade[i].checked != undefined && dataGrade[i].checked != false) {
                selectedData.push(dataGrade[i].val);

            }

        }
        console.log(selectedData);

        var contract = document.getElementById("contractingValue_State").items
        selectedContract = []
        for (i = 0; i < contract.length; i++) {
            if (contract[i].checked != undefined && contract[i].checked != false) {
                selectedContract.push(contract[i].val);

            }
        }
        var customer = document.getElementById("currentCustomer_State").items
        selectedCustomer = []
        for (i = 0; i < customer.length; i++) {
            if (customer[i].checked != undefined && customer[i].checked != false) {
                selectedCustomer.push(customer[i].val);

            }
        }
        var solar = document.getElementById("solarFlag_State").items
        selectedSolar = []
        for (i = 0; i < solar.length; i++) {
            if (solar[i].checked != undefined && solar[i].checked != false) {
                selectedSolar.push(solar[i].val);

            }

        }
        var emgen = document.getElementById("emgenFlag_State").items
        selectedEmgen = []
        for (i = 0; i < emgen.length; i++) {
            if (emgen[i].checked != undefined && emgen[i].checked != false) {
                selectedEmgen.push(emgen[i].val);

            }

        }
        var battery = document.getElementById("batteryFlag_State").items
        selectedBattery = []
        for (i = 0; i < battery.length; i++) {
            if (battery[i].checked != undefined && battery[i].checked != false) {
                selectedBattery.push(battery[i].val);

            }

        }
        var cogen = document.getElementById("cogenFlag_State").items
        selectedCogen = []
        for (i = 0; i < cogen.length; i++) {
            if (cogen[i].checked != undefined && cogen[i].checked != false) {
                selectedCogen.push(cogen[i].val);

            }

        }
        var fuelcell = document.getElementById("fuelcellFlag_State").items
        selectedFuel = []

        for (i = 0; i < fuelcell.length; i++) {
            if (fuelcell[i].checked != undefined && fuelcell[i].checked != false) {
                selectedFuel.push(fuelcell[i].val);

            }

        }
        var stageemission = document.getElementById("stageemissionName_State").items
        selectedStage = []
        for (i = 0; i < stageemission.length; i++) {
            if (stageemission[i].checked != undefined && stageemission[i].checked != false) {
                selectedStage.push(stageemission[i].val);

            }

        }
        var stage3 = document.getElementById("stage3emissionName_State").items
        selectedStage3 = []
        for (i = 0; i < stage3.length; i++) {
            if (stage3[i].checked != undefined && stage3[i].checked != false) {
                selectedStage3.push(stage3[i].val);

            }

        }
        var energy = document.getElementById("energyIntensity_State").items
        selectedEnergy = []
        for (i = 0; i < energy.length; i++) {
            if (energy[i].checked != undefined && energy[i].checked != false) {
                selectedEnergy.push(energy[i].val);

            }
        }
        var renewable = document.getElementById("renewableEnergy_State").items
        selectedRenewable = []
        for (i = 0; i < renewable.length; i++) {
            if (renewable[i].checked != undefined && renewable[i].checked != false) {
                selectedRenewable.push(renewable[i].val);

            }
        }
        console.log(selectedRenewable);
        console.log(selectedContract);


    }
    console.log('here');

    console.log('in it');


// Request to populate middle table in state
    makeRequest('GET', '/DataTable', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        drawTable_State(data)

        for (i = 0; i < result_data.length; i++) {
            dropdownitems.push(result_data[i].Facility_Name)
            dropdownitems_2.push(result_data[i].Building_Name)
        }

        dropdownitems = uniq_fast(dropdownitems)
        dropdownitems_2 = uniq_fast(dropdownitems_2)

        document.getElementById("facilityName_State").items = dropdownitems;
        document.getElementById("buildingName_State").items = dropdownitems_2;





    }
    );


//request to populate the state names, agency and utility 
    makeRequest('GET', '/AllData', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        dropdownitems = ['All'];
        dropdownitems_2 = ['All'];
        dropdownitems_3 = ['All'];
        for (i = 0; i < result_data.length; i++) {
            dropdownitems.push(result_data[i].Agency)



            dropdownitems_2.push(result_data[i].State_Name)


            dropdownitems_3.push(result_data[i].Utility_Partner)


        }
        dropdownitems = uniq_fast(dropdownitems)

        for (i = 1; i < dropdownitems.length; i++) {
            globalAgency.push(dropdownitems[i].val)
        }


        dropdownitems_2 = uniq_fast(dropdownitems_2)

        for (i = 1; i < dropdownitems_2.length; i++) {
            globalState.push(dropdownitems_2[i].val)
        }


        dropdownitems_3 = uniq_fast(dropdownitems_3)

        for (i = 1; i < dropdownitems_3.length; i++) {
            globalUtility.push(dropdownitems_3[i].val)
        }

        document.getElementById("agencyName_State").items = dropdownitems;
        document.getElementById("agency_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
        document.getElementById("stateName_State").items = dropdownitems_2;
        document.getElementById("state_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
        document.getElementById("utilityName_State").items = dropdownitems_3;
        document.getElementById("utility_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);



    }
    );

	
	//populates agency vs Opportunities
    makeRequest('GET', '/chartTable_Agency', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        globalchartdata = result_data;

        for (i = 0; i < result_data.length; i++) {
            stateNamesData.push(result_data[i].Agency)
            opportunitiesData.push(parseInt(result_data[i].Opportunities))
        }
        /*dropdownitems=uniq_fast(dropdownitems) 
        dropdownitems_2=uniq_fast(dropdownitems_2)
        
        console.log(dropdownitems)
        document.getElementById("facilityName").items=dropdownitems; 
        document.getElementById("buildingName").items=dropdownitems_2; 
         */
        //var s1tateNamesData=["StateNames","a","b","c"]
        //var o1pportunitiesData=["Opportunities",10,20,15]
        var chart = c3.generate({
            bindto: "#chartlefttop_agency",
            data: {
                x: 'StateNames',
                columns: [
                    stateNamesData,
                    opportunitiesData

                ],
                //url: '/chartData',
                type: 'bar',
                labels: true
            },
            padding: {
                bottom: 10,
                left: 70
            },
            axis: {

                x: {
                    type: 'category',
                    label: {
                        text: 'State Names',
                        position: 'outer-middle'
                    }
                },
                y: {
                    label: {
                        text: 'Opportunities',
                        position: 'outer-center'
                    }
                },
                rotated: true
            },
            point: {
                show: true
            },
            bar: {
                width: {
                    ratio: 0.8 // this makes bar width 50% of length between ticks
                }
                // or
                //dth: 100 // this makes bar width 100px
            },
            legend:
            { show: false }
        });

    });


    var rome = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-80.41, 28.82]))
    });

    var london = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-85.41, 38.82]))
    });

    /*       var madrid = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
      }); */

    rome.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            color: '#8959A8',
            crossOrigin: 'anonymous',
            scale: '0.6',
            src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
    }));

    london.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            color: '#4271AE',
            crossOrigin: 'anonymous',
            scale: '0.6',
            src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
    }));

    /*       madrid.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ /*({
color: [113, 140, 0],
crossOrigin: 'anonymous',
src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
}))
})); */


    var vectorSource = new ol.source.Vector({
        features: [rome, london]
    });

    vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'https://api.mapbox.com/v4/mapbox.streets-basic.json?access_token=pk.eyJ1Ijoic2VhcmNoaW5nYWtrdSIsImEiOiJjajVrdnVrZ3QybncxMnFvNnZwOXdnNzR3In0.TwSykj2VNdmMWko458WTmQ',
            crossOrigin: ''
        })
    });






    container = document.getElementById('popup_State')

    overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));

    map31 = new ol.Map({
        layers: [rasterLayer, vectorLayer],
        overlays: [overlay],
        target: document.getElementById('map3'),
        view: new ol.View({
            center: ol.proj.fromLonLat([-70.41, 18.82]),
            zoom: 3
        })
    });

    map31.on('pointermove', onMouseMove_State);

    closer = document.getElementById('popup-closer_State')

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };


    makeRequest('GET', '/LongLat', function (err, data) {



        var data = data
        createMarkers(data)
    }
    );



// request to get state name - policies


    makeRequest('GET', '/regulation', function (err, data) {
        // var data = data;
        // createMarkers(data)
          data = JSON.parse(JSON.parse(data).data);

        regulationdata = data;
        var dropdownitems = [];
        for (i = 0; i < data.length; i++) {
            dropdownitems.push(data[i].State)
        }
        dropdownitems = uniq_fast(dropdownitems)
        document.getElementById("statepolicy_State_content").items = dropdownitems
        drawTable_policy(data)
    }
    );

document.getElementById("statepolicy_State_content").addEventListener("px-dropdown-checkbox-changed", filterregulations);




//function to filter the policies based on the state selected 
    function filterregulations() {
        allstate = document.getElementById("statepolicy_State_content").items
        selectedstate = []
        filterdata = []
        for (i = 0; i < allstate.length; i++) {
            if (allstate[i].checked != undefined && allstate[i].checked != false) {

                selectedstate.push(allstate[i].val);

            }
        }
        for (j = 0; j < selectedstate.length; j++) {
            for (i = 0; i < regulationdata.length; i++) {

                if (selectedstate[j] == regulationdata[i].State) {
                    filterdata.push(regulationdata[i]);
                   
                }

            }
        }
        drawTable_policy(filterdata)

    }






//functio to draw table for state- policy table

    function drawTable_policy(data) {
        var nameMapping = {
            State: "State",
            Name: "Policy Link",


        };

        var keys = d3.keys(nameMapping);

        var table = d3.select("#table_policy");
        table.selectAll("*").remove();

        // var ths = theads.selectAll('th').data(keys).enter().append("th").text(function(d) {
        //     return nameMapping[d];
        // });

        var tbodies = table.append("tbody");
        var rows = tbodies.selectAll("tr").data(data);
        rows = rows.enter().append("tr");

        var dataCells = rows.selectAll("td")
            .data(function (d) {
                var values = d3.keys(nameMapping).map(function (key) {
                    return d[key];
                });
                return values;
            });
        dataCells.enter().append("td").text(function (d, i) {
            return d;
        });
    };

}


//function attached with agency overview
function agencyOvrview() {

    console.log('great')
//initialisation for populating the Agency vs Oppurtunities 
    
    var opportunitiesData = ['Opportunities'];
    var stateNamesData = ['StateNames'];
    	//initialise the local variables
    var globalUtility = [];
    var globalAgency = [];
    var globalState = [];
    var globalData = [];
    var globalContract = [];
    var globalSolar = [];
    var globalEmgen = [];
    var globalBattery = [];
    var globalCogen = [];
    var globalFuel = [];
    var globalStage = [];
    var globalStage3 = [];
    var globalEnergy = [];
    var globalRenewable = [];
    var globalCustomer = [];
    var globalchartdata = [];
    var regulationdata = [];
	
	
	//function called on apply button in state function
     function confirmFilters_Agency() {
        var request = new XMLHttpRequest();
        var datapointsUrl = "/scoreCardFiltered";
        request.open('POST', datapointsUrl, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function (response) {
            if (request.status >= 200 && request.status < 400) {
                // document.getElementById('mid-table-loader').style.opacity = '0';
                // document.getElementById('agency-state-name-content').style.opacity = '1';

                // getdropdowns(request.response);
                drawTable_avgScoreCard(request.response);
                drawTable_scoreCard(request.response);
                drawChartLeftTop(request.response, opportunitiesData, stateNamesData, "chartlefttop_agencyview");

            } else {
                console.log("failure on status code");
            }


        };
        request.onerror = function () {
            console.log("failure after success code");
        };

        if (selectedAgency == "") {
            selectedAgency = globalAgency
        }

        if (selectedState == "") {
            selectedState = globalState
        }
        if (selectedUtility == "") {
            selectedUtility = globalUtility
        }
        if (selectedCustomer == "") {
            selectedCustomer = globalCustomer
        }

        if (selectedSolar == "") {
            selectedSolar = globalSolar
        }
        if (selectedStage == "") {
            selectedStage = globalStage
        }
        if (selectedStage3 == "") {
            selectedStage3 = globalStage3
        }

        if (selectedRenewable == "") {
            selectedRenewable = globalRenewable
        }
        if (selectedBattery == "") {
            selectedBattery = globalBattery
        }
        if (selectedFuel == "") {
            selectedFuel = globalFuel
        }

        if (selectedEmgen == "") {
            selectedEmgen = globalEmgen
        }
        if (selectedCogen == "") {
            selectedCogen = globalCogen
        }
        if (selectedContract == "") {
            selectedContract = globalContract
        }

        if (selectedData == "") {
            selectedData = globalData
        }
        if (selectedEnergy == "") {
            selectedEnergy = globalEnergy
        }

		var selectedStartftvalue = document.getElementById("grossSqft_Agency").value;
	    var selectedEndftvalue = document.getElementById("grossSqft_Agency").endValue;


          var requestData = {
            "agency": selectedAgency, "state": selectedState, "utility": selectedUtility,
            "customer": selectedCustomer,"startftvalue": selectedStartftvalue, "endftvalue": selectedEndftvalue, "contract": selectedContract, "battery": selectedBattery, "emgen": selectedEmgen,
            "cogen": selectedCogen, "fuelcell": selectedFuel, "renewable": selectedRenewable, "solar": selectedSolar,
            "stage": selectedStage, "stage3": selectedStage3, "data": selectedData, "energy": selectedEnergy
        };
        // document.getElementById('mid-table-loader').style.opacity = '1';
        // document.getElementById('agency-state-name-content').style.opacity = '0.2';
        request.send(JSON.stringify(requestData));
    };

    
    document.getElementById("applyButton_Agency").addEventListener("click", confirmFilters_Agency);

    document.getElementById("agency_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);

    document.getElementById("state_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);

    document.getElementById("utility_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);



    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
    document.getElementById("dataGrade_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalData.push(dropDownnames[i].val)
    }
    document.getElementById("data_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "UESC" }]
    document.getElementById("contractingValue_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalContract.push(dropDownnames[i].val)
    }
    document.getElementById("contract_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
    document.getElementById("currentCustomer_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalCustomer.push(dropDownnames[i].val)
    }
    document.getElementById("customer_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("solarFlag_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalSolar.push(dropDownnames[i].val)
    }
    document.getElementById("solar_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("batteryFlag_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalBattery.push(dropDownnames[i].val)
    }
    document.getElementById("battery_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("cogenFlag_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalCogen.push(dropDownnames[i].val)
    }
    document.getElementById("cogen_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("emgenFlag_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalEmgen.push(dropDownnames[i].val)
    }
    document.getElementById("emgen_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    document.getElementById("fuelcellFlag_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalFuel.push(dropDownnames[i].val)
    }
    document.getElementById("fuelcell_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    document.getElementById("stageemissionName_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalStage.push(dropDownnames[i].val)
    }
    document.getElementById("stageemission_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }]
    document.getElementById("stage3emissionName_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalStage3.push(dropDownnames[i].val)
    }
    document.getElementById("stage3_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    document.getElementById("energyIntensity_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalEnergy.push(dropDownnames[i].val)
    }
    document.getElementById("energy_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "Not Available" }, { "key": "4", "val": "Red" }]
    document.getElementById("renewableEnergy_Agency").items = dropDownnames
    for (i = 1; i < dropDownnames.length; i++) {
        globalRenewable.push(dropDownnames[i].val)
    }
    document.getElementById("renewable_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    var dropdownitems = [];
    var dropdownitems_2 = [];
    var dropdownitems_3 = [];
	
	//function called when any dropdown value is changed
    function filterdrop() {
        console.log("changed filter value");


        var agency = document.getElementById("agencyName_Agency").items
        selectedAgency = []
        for (i = 0; i < agency.length; i++) {
            if (agency[i].checked != undefined && agency[i].checked != false) {
                if (agency[0].checked == true) {
                    selectedAgency = globalAgency;
                    agency[i].checked = true
                }
                else {
                    selectedAgency.push(agency[i].val);
                }
            }
        }


        var state = document.getElementById("stateName_Agency").items
        selectedState = []
        for (i = 0; i < state.length; i++) {
            if (state[i].checked != undefined && state[i].checked != false) {
                if (state[0].checked == true) {
                    selectedState = globalState;
                    state[i].checked = true
                }
                else {
                    selectedState.push(state[i].val);
                }

            }

        }


        var dataGrade = document.getElementById("dataGrade_Agency").items
        selectedData = []
        for (i = 0; i < dataGrade.length; i++) {
            if (dataGrade[i].checked != undefined && dataGrade[i].checked != false) {
                selectedData.push(dataGrade[i].val);

            }

        }
        console.log(selectedData);

        var contract = document.getElementById("contractingValue_Agency").items
        selectedContract = []
        for (i = 0; i < contract.length; i++) {
            if (contract[i].checked != undefined && contract[i].checked != false) {
                selectedContract.push(contract[i].val);

            }
        }
        var customer = document.getElementById("currentCustomer_Agency").items
        selectedCustomer = []
        for (i = 0; i < customer.length; i++) {
            if (customer[i].checked != undefined && customer[i].checked != false) {
                selectedCustomer.push(customer[i].val);

            }
        }
        var solar = document.getElementById("solarFlag_Agency").items
        selectedSolar = []
        for (i = 0; i < solar.length; i++) {
            if (solar[i].checked != undefined && solar[i].checked != false) {
                selectedSolar.push(solar[i].val);

            }

        }
        var emgen = document.getElementById("emgenFlag_Agency").items
        selectedEmgen = []
        for (i = 0; i < emgen.length; i++) {
            if (emgen[i].checked != undefined && emgen[i].checked != false) {
                selectedEmgen.push(emgen[i].val);

            }

        }
        var battery = document.getElementById("batteryFlag_Agency").items
        selectedBattery = []
        for (i = 0; i < battery.length; i++) {
            if (battery[i].checked != undefined && battery[i].checked != false) {
                selectedBattery.push(battery[i].val);

            }

        }
        var cogen = document.getElementById("cogenFlag_Agency").items
        selectedCogen = []
        for (i = 0; i < cogen.length; i++) {
            if (cogen[i].checked != undefined && cogen[i].checked != false) {
                selectedCogen.push(cogen[i].val);

            }

        }
        var fuelcell = document.getElementById("fuelcellFlag_Agency").items
        selectedFuel = []

        for (i = 0; i < fuelcell.length; i++) {
            if (fuelcell[i].checked != undefined && fuelcell[i].checked != false) {
                selectedFuel.push(fuelcell[i].val);

            }

        }
        var stageemission = document.getElementById("stageemissionName_Agency").items
        selectedStage = []
        for (i = 0; i < stageemission.length; i++) {
            if (stageemission[i].checked != undefined && stageemission[i].checked != false) {
                selectedStage.push(stageemission[i].val);

            }

        }
        var stage3 = document.getElementById("stage3emissionName_Agency").items
        selectedStage3 = []
        for (i = 0; i < stage3.length; i++) {
            if (stage3[i].checked != undefined && stage3[i].checked != false) {
                selectedStage3.push(stage3[i].val);

            }

        }
        var energy = document.getElementById("energyIntensity_Agency").items
        selectedEnergy = []
        for (i = 0; i < energy.length; i++) {
            if (energy[i].checked != undefined && energy[i].checked != false) {
                selectedEnergy.push(energy[i].val);

            }
        }
        var renewable = document.getElementById("renewableEnergy_Agency").items
        selectedRenewable = []
        for (i = 0; i < renewable.length; i++) {
            if (renewable[i].checked != undefined && renewable[i].checked != false) {
                selectedRenewable.push(renewable[i].val);

            }
        }


    }




//request to populate the state names, agency and utility 
    makeRequest('GET', '/AllData', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        dropdownitems = ['All'];
        dropdownitems_2 = ['All'];
        dropdownitems_3 = ['All'];
        for (i = 0; i < result_data.length; i++) {
            dropdownitems.push(result_data[i].Agency)



            dropdownitems_2.push(result_data[i].State_Name)


            dropdownitems_3.push(result_data[i].Utility_Partner)


        }
        dropdownitems = uniq_fast(dropdownitems)

        for (i = 1; i < dropdownitems.length; i++) {
            globalAgency.push(dropdownitems[i].val)
        }


        dropdownitems_2 = uniq_fast(dropdownitems_2)

        for (i = 1; i < dropdownitems_2.length; i++) {
            globalState.push(dropdownitems_2[i].val)
        }


        dropdownitems_3 = uniq_fast(dropdownitems_3)

        for (i = 1; i < dropdownitems_3.length; i++) {
            globalUtility.push(dropdownitems_3[i].val)
        }

        document.getElementById("agencyName_Agency").items = dropdownitems;
        document.getElementById("agency_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
        document.getElementById("stateName_Agency").items = dropdownitems_2;
        document.getElementById("state_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
        document.getElementById("utilityName_Agency").items = dropdownitems_3;
        document.getElementById("utility_Agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);



    }
    );
	 makeRequest('GET', '/totalscore', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        drawTable_avgScoreCard(result_data);
    });
    makeRequest('GET', '/scorecard', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        drawTable_scoreCard(result_data);
    });
     function drawTable_scoreCard(data) {
        var score_color = {
            'Green': 'Green',
            'Yellow': 'Yellow',
            'Red': 'Red',
            'Not Available': 'Grey'
        };
        //data = JSON.parse(JSON.parse(data).data);
        console.log(data);
        var nameMapping = {
            Agency: "Agency",
            Stage_1_2_GHG_emissions: "Stage_1_2_Emissions",
            Stage_3_GHG_emissions: "Stage_3_Emissions",
            Reduction_in_Energy_Intensity: "Reduction In Energy",
            Usage_of_renewable_energy: "Use Of Renewable Energy"
        };
        var keys = d3.keys(nameMapping);
        var table = d3.select("#agency_scorecard");
        table.selectAll("*").remove();
        var tbodies = table.append("tbody");
        var rows = tbodies.selectAll("tr").data(data);
        rows = rows.enter().append("tr");

        var dataCells = rows.selectAll("td")
            .data(function (d) {
                var values = d3.keys(nameMapping).map(function (key) {
                    return d[key];
                });
                return values;
            });
        dataCells.enter().append("td").text(function (d, i) {
            if (!(d in score_color)) {
                return d;
            }
                });		
        dataCells.style('background-color', function (d) {		
            if (d in score_color) {		
                return 'white';		
            }		
        }).style('width', function (d) {		
            return '100px';		
        });		
        dataCells.append('div');		
        dataCells.select('div').style('height', function (d) {		
            if (d in score_color) {		
                return '20px';		
            }		
        }).style('margin-left', function (d) {		
            return '20px';		
        }).style('margin-right', function (d) {		
            return '20px';
        }).style('background-color', function (d) {
            if (d in score_color) {
                return score_color[d];
            }
        });
    };

	
	
	//function to populate middle table in the agency
	
    function drawTable_avgScoreCard(data) {
        //data = JSON.parse(JSON.parse(data).data);
        var nameMapping = {
            Agency: "Agency",
            Total_Score: "Score",
            Count: "Count Of Facilities"
        };
        var keys = d3.keys(nameMapping);
        var table = d3.select("#agency_avgscore");
        table.selectAll("*").remove();
        var tbodies = table.append("tbody");
        var rows = tbodies.selectAll("tr").data(data);
        rows = rows.enter().append("tr");

        var dataCells = rows.selectAll("td")
            .data(function (d) {
                var values = d3.keys(nameMapping).map(function (key) {
                    return d[key];
                });
                return values;
            });
        dataCells.enter().append("td").text(function (d, i) {
            return d;
        }).style('width', function (d) {
          return '33%';
        });
    };

    		//functio to populate agency vs opportunities
    makeRequest('GET', '/chartTable_Agency', function (err, data) {
        result_data = JSON.parse(data)
        console.log(result_data)
        result_data = JSON.parse(result_data.data)
        console.log(result_data)
        globalchartdata = result_data;

        for (i = 0; i < result_data.length; i++) {
            stateNamesData.push(result_data[i].Agency)
            opportunitiesData.push(parseInt(result_data[i].Opportunities))
        }
        var chart = c3.generate({
            bindto: "#chartlefttop_agencyview",
            data: {
                x: 'StateNames',
                columns: [
                    stateNamesData,
                    opportunitiesData

                ],
                //url: '/chartData',
                type: 'bar',
                labels: true
            },
            padding: {
                bottom: 10,
                left: 70
            },
            axis: {

                x: {
                    type: 'category',
                    label: {
                        text: 'Agency Names',
                        position: 'outer-middle'
                    }
                },
                y: {
                    label: {
                        text: 'Opportunities',
                        position: 'outer-center'
                    }
                },
                rotated: true
            },
            point: {
                show: true
            },
            bar: {
                width: {
                    ratio: 0.8 // this makes bar width 50% of length between ticks
                }

                // or
                //dth: 100 // this makes bar width 100px
            },
            legend:
            { show: false }
        });

    });
	//populates agency vs Opportunities
   
}
