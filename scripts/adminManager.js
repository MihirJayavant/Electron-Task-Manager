let dbOperations = require('../core/databaseOperations');
let Util = require('../core/util');

const util = new Util();


module.exports = class adminManager 
{

    async saveTask() 
    {
        try 
        {
            let data = [];
            const dbOps = new dbOperations();

            data.push(document.getElementById('adm-Tsk-Project').value);
            data.push(document.getElementById('adm-Tsk-Module').value);
            data.push(document.getElementById('adm-Tsk-Title').value);
            data.push(document.getElementById('adm-Tsk-Desc').value);
            data.push(document.getElementById('adm-Tsk-ETA').value);
            data.push(document.getElementById('adm-Tsk-Owner').value);
            data.push(document.getElementById('adm-Tsk-Assign').value);
            data.push(document.getElementById('adm-Tsk-Type').value);
            data.push(document.getElementById('adm-Tsk-Priority').value);
            data.push(document.getElementById('adm-Tsk-Order').value);

            let keys = ["TaskId" , "Module", "Title", "Description", "DateTerminated", "Owner", "Assign", "Type", "Priority", "Order"];

            await this.saveObject("Task_master" , keys , data , dbOps);
        }
        catch (error) {
            console.log("Error due to : " + error);
        }

    }

    //-----------------------------------------------------------
    // USER CREATION OPERATIONS
    //-----------------------------------------------------------
    async createUser()
    {
        console.log("INSIDE USER CREATION")
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(document.getElementById('adm-Usr-Name').value);
        data.push(document.getElementById('adm-Usr-Contact').value);
        data.push(document.getElementById('adm-Usr-DOB').value);
        data.push(document.getElementById('adm-Usr-Email').value);
        data.push(document.getElementById('adm-Usr-Email').value);
        data.push(document.getElementById('adm-Usr-Password').value);
        data.push("0");
        data.push(util.getCurrentDateString());
        
        let keys = [ "UserId", "Name", "Contact", "DOB", "Email", "UserName" , "Password" , "RoleId" , "DateCreated"]
        let arrEncryptedCols = [5,6];

        for (let index = 0; index < data.length; index++) 
        {
            let flag = false;
            for (let index2 = 0; index2 < arrEncryptedCols.length; index2++) 
            {
                if(index == arrEncryptedCols[index2])
                {
                    flag = true
                }
            }     
            if (flag)
            {
                data[index] = " PGP_SYM_ENCRYPT( '" + data[index] + "' , 'AES_KEY') "    
            }           
        }

        let keyString = util.generateCustomArrayString("\"" , keys);
        let arrColsToIgore = [0,5,6];
        let dataString = util.generateCustomArrayString("\'" , data , arrColsToIgore);
        let result = await this.addObjectToDatabase("User_master" , keyString , dataString, dbOps );
        console.log(result);
    }

    async getUserId(email)
    {
        let columns = ["\"UserId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Email\" = \'" + email + "\'"
        let data = await dbOps.getData("User_master" , columns , conditon)
        return data["rows"][0]["UserId"];
    }

    async createUserAssignerMap(userId , assignerId)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push(userId);
        data.push(assignerId);
        let keys = ["UserId" , "ReportingUserId"];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data);
        let result = dbOps.addData("user_user_map" , keyString , dataString);
        console.log(result);
    }

    async updateUserAssignerMap(userId , targetUerId)
    {
        const dbOps = new dbOperations();
        let arrColumns = [ "\"ReportingUserId\""];
        let arrData = [targetUerId];
        let conditon = "\"UserId\" = '" + userId + "'";
        let result = dbOps.updateData("user_user_map" , arrColumns , arrData , conditon );
        console.log(result);
    }

    async createUserProjectMap(userId , projectId)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push(userId);
        data.push(projectId);
        let keys = ["UserId" , "ProjectId"];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data);
        let result = dbOps.addData("user_project_map" , keyString , dataString);
        console.log(result);
    }

    async updateUserProjectMap(userId , projectId)
    {
        const dbOps = new dbOperations();
        let arrColumns = [ "\"ProjectId\""];
        let arrData = [projectId];
        let conditon = "\"UserId\" = '" + userId + "'";
        let result = dbOps.updateData("user_project_map" , arrColumns , arrData , conditon );
        console.log(result);
    }

    //-----------------------------------------------------------
    // ASSETS OPERATIONS
    //-----------------------------------------------------------
    async createModule(moduleName)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(moduleName);
        data.push(util.getCurrentDateString());
        let keys = ["ModuleId","Module","DateCreated"];
        let arrColsToIgore = [0];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data , arrColsToIgore);
        var result = await this.addObjectToDatabase("Module_master", keyString, dataString, dbOps);
        console.log(result);
        
    }

    async getModuleId(moduleName)
    {
        let columns = ["\"ModuleId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Module\" = \'" + moduleName + "\'"
        let data = await dbOps.getData("Module_master" , columns , conditon)
        return data["rows"][0]["ModuleId"];
    }

    async createModuleProjectMap(moduleId , projectId)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push(moduleId);
        data.push(projectId);
        let keys = ["ModuleId" , "ProjectId"];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data);
        let result = dbOps.addData("module_project_map" , keyString , dataString);
        console.log(result);
    }

    async createType(typeName)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(typeName);
        data.push(util.getCurrentDateString());
        let keys = ["TypeId","Type","DateCreated"];
        let arrColsToIgore = [0];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data , arrColsToIgore);
        var result = await this.addObjectToDatabase("Type_master", keyString, dataString, dbOps);
        console.log(result);        
    }

    async getTypeId(typeName)
    {
        let columns = ["\"TypeId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Type\" = \'" + typeName + "\'"
        let data = await dbOps.getData("Type_master" , columns , conditon)
        return data["rows"][0]["TypeId"];
    }

    async createTypeProjectMap(typeId , projectId)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push(typeId);
        data.push(projectId);
        let keys = ["TypeId" , "ProjectId"];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data);
        let result = dbOps.addData("type_project_map" , keyString , dataString);
        console.log(result);
    }

    async createPriority(priorityName)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(priorityName);
        data.push(util.getCurrentDateString());
        let keys = ["PriorityId","Priority","DateCreated"];
        let arrColsToIgore = [0];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data , arrColsToIgore);
        var result = await this.addObjectToDatabase("Priority_master", keyString, dataString, dbOps);
        console.log(result);        
    }

    async getPriorityId(priorityName)
    {
        let columns = ["\"PriorityId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Priority\" = \'" + priorityName + "\'"
        let data = await dbOps.getData("Priority_master" , columns , conditon)
        return data["rows"][0]["PriorityId"];
    }

    async createPriorityProjectMap(priorityId , projectId)
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push(priorityId);
        data.push(projectId);
        let keys = ["PriorityId" , "ProjectId"];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let dataString = util.generateCustomArrayString("\'" , data);
        let result = dbOps.addData("priority_project_map" , keyString , dataString);
        console.log(result);
    }
    //-----------------------------------------------------------
    // PROJECT CREATION OPERATIONS
    //-----------------------------------------------------------
    async createProject()
    {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(document.getElementById('adm-Proj-Title').value);
        data.push(util.getCurrentDateString());
        let keys = ["ProjectId" , "ProjectName" , "DateCreated"];
        let keyString = util.generateCustomArrayString("\"" , keys);
        let arrColumnsToIgnore = [];
        arrColumnsToIgnore.push(0);
        let dataString = util.generateCustomArrayString("\'" , data , arrColumnsToIgnore);
        var result = await this.addObjectToDatabase("Project_master" , keyString , dataString ,dbOps);
        console.log(JSON.stringify(result));
    }

    async getProjectIdFromUser(userId)
    {
        let columns = ["\"ProjectId\""];
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = \'" + userId + "\'"
        let data = await dbOps.getData("user_project_map" , columns , conditon)
        return data["rows"][0]["ProjectId"];
    }

    //-----------------------------------------------------------
    // GENERIC OPERATIONS
    //-----------------------------------------------------------
    async addObjectToDatabase(type , keys , arrData , dbOps , isEncrypted , arrEncrypted)
    {
        if(isEncrypted)
        {
            var result = dbOps.addEncryptedData(type , keys , arrData , arrEncrypted)
        }   
        else
        {
            var result = dbOps.addData(type , keys , arrData)
        }
        return result;
        
    }
}