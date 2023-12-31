const Job=require('../models/Job')
const StatusCode=require('http-status-codes')
const {BadRequestError,NotFoundError}=require('../errors')

const getAllJobs=async (req,res)=>{
    const jobs =await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCode.OK).json({count:jobs.length,jobs})
}


const createJob=async (req,res)=>{
        req.body.createdBy=req.user.userId
        const job=await Job.create(req.body)
        res.status(StatusCode.CREATED).json({job})
}

const getJob=async (req,res)=>{
    const {userId}=req.user  

    const job=await Job.findById({createdBy:userId,_id:req.params.id})

    if(!job){
        throw new NotFoundError("not found job for user on given id")
    }
    res.status(StatusCode.OK).json(job)
}

const updateJob=async (req,res)=>{
        const {
            body:{company,position} ,
            params:{id:jobId},
            user:{userId}
          }=req
      
          if(company==="" || position===''){
              throw new BadRequestError("provide email and position")
          }
          const job=await Job.findByIdAndUpdate(
              {createdBy:userId,_id:jobId},
              req.body,
              {runValidators:true,new:true}
          )
          if (!job) {
            throw new NotFoundError(`No job with id ${jobId}`)
          }
          res.status(StatusCode.OK).json(job)
    
}

const deleteJob=async (req,res)=>{
    const {
        user:userId,
        params:jobId
    }=req

    const job=Job.findByIdAndRemove({
        createdBy:userId,_id:jobId
    })
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
    res.status(StatusCode.OK).json("deleted")
        
    
}


module.exports = {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    getJob,
  }