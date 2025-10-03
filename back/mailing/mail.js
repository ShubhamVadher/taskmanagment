const nodemailer=require('nodemailer');

const pass=process.env.password
const mailer_id=process.env.emailid


const mail=async(email,created_by,task_name)=>{
    const mailerdata=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:mailer_id,
            pass:pass
        }
    })
    const info=await mailerdata.sendMail({
        from:mailer_id,
        to:email,
        subject:'New Task Assigned',
        text:`hey... you have new task assigned by ${created_by}\nlogin into your Taskflow to mark updates in ${task_name}`
    })
}


module.exports={mail};