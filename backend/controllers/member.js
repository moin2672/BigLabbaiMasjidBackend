const Member = require('../models/member');

isNumeric = (num) => {
    return !isNaN(num);
}
padLeft = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || "0") + nr;
}


exports.createMember=(req, res, next) =>{

    let namingConvention="RLM "

    let fetchedMembers;
    let lastMember;
    let genBillNoVal="";

    Member.find()
        .then(members => {
            fetchedMembers = members;
            return Member.countDocuments();
        })
        .then(count => {
            if (fetchedMembers[count - 1]) {
                lastMember = fetchedMembers[count - 1]
            } else {
                lastMember = { memberIdNo: "0" }
            }
            let lastMemberBillNo = lastMember.mID;
            let maxMemberCount = count;
            let lastBillNo_num = 0;
            console.log("********=")
            console.log("lastMemberBillNo=",lastMemberBillNo)
            console.log("maxMemberCount=",maxMemberCount)
            console.log("********=")
            let billNoAr = lastMemberBillNo.split(" ");

            for (let i = 0; i < billNoAr.length; i++) {
                if (isNumeric(billNoAr[i].trim())) {
                    lastBillNo_num = Number(billNoAr[i].trim());
                    if (lastBillNo_num >= maxMemberCount) {
                        genBillNoVal =
                        namingConvention + padLeft(lastBillNo_num + 1, 5, "0");
                    } else {
                        genBillNoVal =
                        namingConvention + padLeft(maxMemberCount + 1, 5, "0");
                    }
                }
            }
            const member=new Member({
                mID:genBillNoVal,
                initials: req.body.initials,
                name: req.body.name,
                fathersName: req.body.fathersName,
                age: req.body.age,
                doorNo: req.body.doorNo,
                streetName: req.body.streetName,
                lastUpdatedDate: req.body.lastUpdatedDate,
                creator:req.userData.userId
            });
            console.log("member=", member)
            member.save().then(createdMember=>{
                console.log("member added success")
                console.log(createdMember._id)
                res.status(201).json({
                    message:"Member added successfully!",
                    memberId: createdMember._id
                });
            })
            .catch(error=>{
                console.log(error)
                res.status(500).json({message:'Creating a Member failed!'})
            });

        }).catch(error=>{
            console.log("error in id generation:", error)
        })

    
}

exports.updateMember=(req, res, next)=>{
    const member = new Member({
        _id:req.body._id,
        mID:req.body.mID,
        initials: req.body.initials,
        name: req.body.name,
        fathersName: req.body.fathersName,
        age: req.body.age,
        doorNo: req.body.doorNo,
        streetName: req.body.streetName,
        lastUpdatedDate: req.body.lastUpdatedDate,
        creator:req.userData.userId
    })
    Member.updateOne({_id:req.params.id,creator: req.userData.userId}, member)
        .then(result=>{
            console.log("updateMember")
            console.log(result)
            if(result.matchedCount>0){
                res.status(200).json({message:"Member updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Member failed!'})
        });
}

exports.getMembers=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const memberQuery=Member.find();
    let fetchedMembers;
    if(pageSize && currentPage){
        memberQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    memberQuery
        .then(documents=>{
            fetchedMembers=documents;
            return Member.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Member fetched successfully", 
                members:fetchedMembers,
                maxMembers:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Members failed!'})
        });
}

exports.getMember=(req, res, next)=>{
    Member.findById(req.params.id)
        .then(member=>{
            if(member){ 
                res.status(200).json({member:member})
            }else{
                res.status(404).json({message:"Member not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Member failed!'})
        });
}

exports.deleteMember=(req, res, next)=>{
    Member.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Member Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Member failed!'})
    });
}



exports.searchMember = (req, res, next)=>{

    console.log(req.query)

    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
    
console.log(req.query);
console.log(searchText)
        
    let memberQuery=Member.find();
    let fetchedMembers;
    
    
    if(searchText){
        console.log("inside")
        console.log(searchText)
        if(searchText!=""){
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
       
        memberQuery=Member.find({$or:[{'mID':CheckValue},{'name':CheckValue},{'fathersName':CheckValue},{'age':CheckValue},{'doorNo':CheckValue},{'streetName':CheckValue}]});
        }     
    }

    
    memberQuery
    .then(members=>{
        membersCount=members.length;
       console.log("inside members - Count")
       // console.log(membersCount)
        if(pageSize && currentPage){
            memberQuery
                .skip(pageSize*(currentPage-1))
                .limit(pageSize)
                // console.log("inside pagination")
        }
        memberQuery.clone()
            .then(members=>{
                fetchedMembers=members;
                // console.log("inside members")
                //console.log(members.length)
                //console.log(fetchedMembers.length)
               
            })
            .then(count=>{
                console.log("inside count")
                // console.log(count)
                // FOR DUMMY USE 'COUNT = '
                if(searchText!="" || typeof(searchText)!="undefined" ){
                    count= fetchedMembers.length;
                    // console.log(count)
                }
                // console.log("membersCount=",membersCount)
                // console.log("count=",count)
                res.status(200).json({
                    message:"Filtered Members fetched successfully", 
                    members:fetchedMembers,
                    maxMembers:membersCount
                });
            })
            .catch((error)=>{
                console.log(error);//console.log("Unable to get filtered members")
                res.status(500).json({message:'Failed to fetch filtered Members!'})
            });
    })
    .catch((error)=>{
        console.log(error);console.log("Unable to get membersCount")
        res.status(500).json({message:'Failed to fetch Members Count!'})
    }); 
}


exports.searchMemberName = (req, res, next)=>{

    console.log(req.query)

    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
    
console.log(req.query);
console.log(searchText)
        
    let memberQuery=Member.find();
    let fetchedMembers;
    
    
    if(searchText ){
        console.log("inside")
        console.log(searchText)
        if(searchText!=""){
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
       
        memberQuery=Member.find({'name':CheckValue});
        }     
    }

    if(pageSize && currentPage){
        memberQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    memberQuery
        .then(documents=>{
            fetchedMembers=documents;
            return Member.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Filtered Member fetched successfully", 
                members:fetchedMembers,
                maxMembers:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Filtered Fetching Members failed!'})
        });    
}


exports.getMembersgroupByStreet=(req, res, next)=>{

    console.log("calling group by")
      
      Member.aggregate([
        {
          $group: {
            _id: '$streetName',
            count: { $sum: 1 } // this means that the count will increment by 1
          }
        },{ "$sort": { "count": -1 } },
      ]) .then(doc=>{
        console.log(doc)
        res.status(200).json({
            message:"No. of Members group by street fetched successfully", 
            membersGroupByStreet:doc,
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Fetching No. of Members group by street failed!'})
    });

}

exports.getMembersListgroupByStreet=(req, res, next)=>{

    Member.aggregate([{$group: { '_id': '$streetName', members:{$push:{mID:"$mID",initials:"$initials",name:"$name",fathersName:"$fathersName",age:"$age",doorNo:"$doorNo"}}}}]).then(doc=>{
        console.log(doc)
        res.status(200).json({
            message:"Members Lit group by street fetched successfully", 
            membersGroupList:doc,
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Fetching Members List group by street failed!'})
    });

}


exports.getMembersTotalcount=(req, res, next)=>{

    console.log("members count")

    Member.count().then(totalCount=> { 
        res.status(200).json({
        message:"Total no of Members fetched successfully", 
        totalMembers:totalCount,
    });
})
.catch(error=>{
    console.log(error)
    res.status(500).json({message:'Fetching Total no of Members failed!'})
});

}
