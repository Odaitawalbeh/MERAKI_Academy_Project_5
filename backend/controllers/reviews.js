const {pool} =require('../models/db')

const addWorkerReview =(req ,res)=>{
    const {review,customer_id,worker_id} =req.body
    const data =[review,customer_id,worker_id]
    const query=`INSERT INTO worker_reviews(review,customer_id,worker_id) VALUES($1 , $2 , $3) RETURNING *`
    pool.query(query , data)
    .then((result)=>{
     res.status(200).json({
      success:true,
      message:'Success Operation',
      result: result.rows
     })
    })
    .catch((err)=>{
      res.status(500).json({
        success:false,
        message:'Server Error',
        result: result.rows
       })
    })
}

const updateReviewid =(req , res)=>{
  const {review ,customer_id ,worker_id} =req.body
  const id = req.params.id
  data=[review || null, customer_id || null,worker_id || null,id]
  const query=`UPDATE worker_reviews SET 
   review= COALESCE($1 ,review ),
   customer_id= COALESCE($2 ,customer_id ),
   worker_id= COALESCE($3 ,worker_id )
  WHERE id=$4 RETURNING *`
  pool.query(query , data)
  .then((result)=>{ 
    if (result.rows.length === 0) {
      res.status(404).json({
       success: false,
       massage: `The Review:${id} is not Found`,
     });
   } else {
     res.status(200).json({
       success: true,
       massage: `Updated successfully`,
       result: result.rows[0],
     });
   }
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({
      success : false,
      message:'Server Error',
      Error : err
    })
  })

}

module.exports={addWorkerReview,updateReviewid}
