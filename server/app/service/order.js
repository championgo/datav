'use strict';

const Service = require('egg').Service;
const fs = require('mz/fs');

class Order extends Service {


  async download(){
        const  sequelize = this.app.model
         //let items = await sequelize.query('select a.* from data_shipping as a inner join count_shipping as b on b.phone = a.phone where b.o_count is null',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         let items = await sequelize.query('select * from language where en is not null',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});

      return items;
         

  }

  async uploadExcel(data) {
    try {
      data.map((item,idx) => {
          let i_data = []
          item.data.map(sub_item=>{
              sub_item['sheet_idx'] = idx;
              sub_item['title'] = item.name;
              i_data.push(sub_item)
          })
           this.ctx.model.OShipping.bulkCreate(i_data);

      });
      return { error: 0, errmsg: '操作成功' };
    } catch (err) {
      this.logger.error(err);
      return { error: 1, errmsg: 'System is too busy,  please try later.' };
    }
  }

 async updateOrder() {
    try {
        const {ctx} = this
        const sequelize = this.app.model
        const Op = this.app.Sequelize.Op;
        const options ={
            //limit:200,
      attributes: [['id','order_product_id'],'product_name',['product_num','quantity'],[sequelize.literal('(SELECT order_no from orders where id = orders_products.order_id )'), "order_id"],[sequelize.literal('(SELECT user_name from orders_address where order_id = orders_products.order_id )'), "name"],[sequelize.literal('(SELECT user_phone from orders_address where order_id = orders_products.order_id )'), "phone"],[sequelize.literal('(SELECT user_address from orders_address where order_id = orders_products.order_id )'), "address"],[sequelize.literal('(SELECT status from orders where id = orders_products.order_id )'), "status"],'created_at'],
            where:{[Op.or]:[
                { product_name: { [Op.like]: '%黄桃%' } },
                { product_name: { [Op.like]: '%红桃%' } }
            ]
            },
            raw:true
    }
        const result = await this.ctx.model.OrdersProducts.findAll(options);
        let insert_data = []
        result.map(item=>{
            if(item.status > 0){
                insert_data.push(item);
            }
            if(insert_data.length >=500){
                this.ctx.model.DataShipping.bulkCreate(insert_data)
                insert_data = []
            }
        })
        return result

    
      //return { error: 0, errmsg: '操作成功' };
    } catch (err) {
      this.logger.error(err);
      return { error: 1, errmsg: 'System is too busy,  please try later.' };
    }
  }

    // 同步count
     async updateCount() {
          const  sequelize = this.app.model
         /* let items = await sequelize.query('select count(id) as data_count,phone from data_shipping group by phone',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         let o_items = await sequelize.query('select count(id) as o_count,phone from o_shipping group by phone',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         items.map((item,idx)=>{
             o_items.map(o_item =>{
                 if(o_item.phone == item.phone){
                     items[idx]['o_count'] = o_item.o_count
                 }
             })

         })
         await this.ctx.model.CountShipping.bulkCreate(items)*/

         /*let items = await sequelize.query('select concat(province,city,district,user_address) as address,user_id,user_phone as phone,user_name as name from orders_address',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         let c_items = await sequelize.query('select * from count_shipping where address is null',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         items.map(item=>{
             c_items.map(c_item=>{
                 if(c_item.phone == item.phone){
             this.ctx.model.CountShipping.update({name:item.name,address:item.address},{where:{phone:c_item.phone}})
             this.ctx.model.DataShipping.update({name:item.name,address:item.address},{where:{phone:c_item.phone}})
                 }
             })
         })*/
        /* let items = await sequelize.query('select count(id) as data_count,phone from data_shipping group by phone',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         let o_items = await sequelize.query('select count(id) as o_count,phone from o_shipping group by phone',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});*/
         //let items = await sequelize.query('select order_shipping ',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         let items = await sequelize.query('select a.id,a.order_id,a.product_sku_id,products,(select id from orders_products where product_sku_id = a.product_sku_id and order_id = a.order_id) as op_id from orders_shipping_bk as a where order_product_id = 0 or order_product_id is null limit 1000',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});

          items.map(item=>{
              console.log(item)
               //this.ctx.model.OrdersShippingBk.update({order_product_id:item.op_id},{where:{id:item.id}})
          })


           /*let insert_data = []
        items.map(item=>{
            let products = JSON.parse(item.products);
             products.map(pro=>{
                 item['product_sku_id'] = pro
                 delete(item['id'])
                insert_data.push(item);
             })
            if(insert_data.length >=1000){
                this.ctx.model.OrdersShippingBk.bulkCreate(insert_data)

                insert_data = []
            }
        })*/
         //await this.ctx.model.OrdersShippingBk.bulkCreate(insert_data)

          return { error: 0, errmsg: '操作成功' };

     }

    updateLan(name,key,data){
         const {ctx} = this;
         ctx.model.Language.create({file_name:name,parent_id:0,original_field:key}).then(res=>{
                    console.log(res.id)
                Object.keys(data).map(s_key=>{
                      if (typeof(data[s_key]) == 'object'){
                        this.updateLan(name,s_key,data[s_key]);
                      }else{
                  ctx.model.Language.create({file_name:name,parent_id:res.id,original_field:s_key,en:data[s_key]});
                      }
                })
                })
    }

    async getLan(data) {
        const {ctx} = this
        const sequelize = this.app.model
        const Op = this.app.Sequelize.Op;
        let names = [];
        let files = [];
        data.map(item=>{
            names.push({'file_name':item.name})
            Object.keys(item.value).map(key=>{
                console.log(key)
                if (typeof(item.value[key]) == 'object'){
                    this.updateLan(item.name,key,item.value[key])

                }else{
                    console.log(item.value[key])
                    //files.push({file_name:item.name,parent_id:0,original_field:key,en:item.value[key]})
                ctx.model.Language.create({file_name:item.name,parent_id:0,original_field:key,en:item.value[key]});
                }

            })
        })
        //ctx.model.LanguageFile.bulkCreate(names)
        //ctx.model.Language.bulkCreate(files)
        return files;

    }


}

module.exports = Order;
