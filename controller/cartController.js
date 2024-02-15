const products=require('../models/productModel')
const catagory=require('../models/catagoryModel')
const User=require('../models/userModel')
const Cart=require('../models/cartModel')

module.exports={

    GetCart:async (req,res)=>{
        try{
            const userid=req.session.user_Id

            const cartData=await Cart.findOne({userId:userid})
            
            req.session.Carid=userid
            const firstdate=req.session.usertime
            

            


            if(cartData!=null){
                 
                const [cartdemy]= await Promise.all([
                    Cart.findOne({userId:userid}).populate("products.productId"),
                   
                  
                ])
                
                console.log(cartdemy);
                const Carts=cartdemy.products
                const prodctLength=cartdemy.products.length
                // console.log(cartdemy.products.images);
                // console.log(Carts,"jijijiji");
                // Carts.forEach(ele=>{
                //     console.log(ele.productId.images[0],"joins");
                // })
              

                let total=0
                let grandtotal=0
                let totalDiscount=0

                Carts.forEach(item=>{
                    let quantity=parseInt(item.quantity)
                    let price=parseInt(item.productId.Price)
                    let DiscountAmount=parseInt(item.productId.DiscountAmount)
                   

                    grandtotal+=quantity*DiscountAmount
                       total+=quantity*price
                       


                })
                totalDiscount+=total-grandtotal
                console.log(total,"total");
                console.log(grandtotal,"this is");
              
                console.log(totalDiscount,);


                //adding all data to session 
               req.session.Totalamnt=total
               req.session.Grandamnt=grandtotal
               req.session.Discount=totalDiscount





                res.render('user/cart',{Carts,total,grandtotal,totalDiscount,prodctLength})
                



            
            }else{
                res.render('user/Emptycart')
            }




           






        }catch(err){
        console.log('secod cart',err);
        }
    },
    

    addTocart:async (req,res)=>{
        try{
            console.log("jhkgkgk",req.params);
            const productid=req.params.productid
            const user= await User.findOne({name:req.session.user}) 
           
            if(user){

                const carts= await Cart.findOne({userId:user._id})

                const productdetail= await products.findOne({_id:productid})

                 if(productdetail.AvailableQuantity!=0){
                    if(carts==null){
                        console.log("usercartnull")
                        const cartData = {
                          userId: user._id,
                          products: [
                            {
                              productId: req.params.productid,
                              quantity: 1,
                              Price: productdetail.Price,
                            },
                          ],
                        };
                        await Cart.create(cartData)
                        res.json({msg:"added to cart successfult"})
                    }else{

                        console.log("userCart not null product available");
                         let productalready= await Cart.findOne({userId:user._id,'produts.productId':productid})

                         if(productalready){
                            console.log("increment the quantity")

                            await Cart.updateOne({userId:user._id,
                                'products.productId':productid},
                            {$inc:
                                { 'products.quantity':1}
                            })

                            res.json({msg:"Product again added"})


                         }else{

                            console.log("push the product in cart");
                            await Cart.updateOne(
                              { userId: user._id },
                              {
                                $push: {
                                  products: {
                                    productId: productid,
                                    quantity: 1,
                                    Price: productdetail.Price,
                                  },
                                },
                              }
                            );
                              res.json({msg:"Product added in cart"})
                              
                         }

                    }
                 }else{
                    res.json({msg:"Product is out of stock."})
                 }



            }else{
                res.json({msg:"User not found"})
            }
            
             }catch(err){
            console.log("yes mistake in Addtocart",err);
        }
    },

    //update the quantity

    Updatequantity:async(req,res)=>{
        try{

            console.log(req.params);
            const prodct=await products.findOne({_id:req.params.prodId})


            if(req.params.count==1){

                if(prodct.AvailableQuantity==req.params.qnt){
                     res.json({msg:"Out of stock  this product"})
                }else{
                    await Cart.updateOne({userId:req.session.user_Id,'products.productId':req.params.prodId},{$inc:{'products.$.quantity':1}})
                    res.json({msg:" You've changed  QUANTITY"})

                }
            }else{
                await Cart.updateOne({userId:req.session.user_Id,'products.productId':req.params.prodId},{$inc:{'products.$.quantity':-1}})
                res.json({msg:" You've changed  QUANTITY-"})

            }






        }catch(err){
            console.log(err);
        }

    },



    //remove cartproducts
    Removecartproduct:async(req,res)=>{
        try{
            console.log(req.params.crtprdctId);

            await Cart.updateOne({userId:req.session.user_Id},{$pull:{products:{productId:req.params.crtprdctId.trim()}}})
            res.json({msg:"Successfully removed  from your cart"})



         

        }catch(err){





        }
        





    }
    
    
}


