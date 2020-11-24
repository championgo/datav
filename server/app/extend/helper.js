'use strict';

module.exports = {

  async exportExcel(data, headers, name) {
    const Excel = require('exceljs');
    let columns = [];//exceljs要求的columns
    let titleRows = headers.length;//标题栏行数

    //处理表头
    for (let i = 0; i < titleRows; i++) {
      let row = headers[i];
      for (let j = 0, rlen = row.length; j < rlen; j++) {
        let col = row[j];
        let { f, t, w = 15 } = col;
        col.style = { alignment: { vertical: 'middle', horizontal: 'center' } };
        col.header = t;
        col.key = f;
        col.width = w;
        columns.push(col);
      }
    }


    let excel_data = []

    for (let i = 0, len = data.length; i < len; i++) {
      let tr = {};
      let item = data[i];

      for (let i = 0; i < headers[0].length; i++) {
        let { f } = headers[0][i];
        console.log(f)
        tr[f] = item[f]
      }
      console.log(tr)
      excel_data.push(tr);
    }

    let workbook = new Excel.Workbook();
    let sheet = workbook.addWorksheet('My Sheet', { views: [{ xSplit: 1, ySplit: 1 }] });
    sheet.columns = columns;
    sheet.addRows(excel_data);

    //处理复杂表头
    if (titleRows > 1) {
      for (let i = 1; i < titleRows; i++)  sheet.spliceRows(1, 0, []);//头部插入空行

      for (let i = 0; i < titleRows; i++) {
        let row = headers[i];
        for (let j = 0, rlen = row.length; j < rlen; j++) {
          let col = row[j];
          if (!col.m1) continue;

          sheet.getCell(col.m1).value = col.t;
          sheet.mergeCells(col.m1 + ":" + col.m2);
        }
      }
    }

    //处理样式、日期、字典项
    let that = this;
    sheet.eachRow(function (row, rowNumber) {
      //设置行高
      row.height = 25;

      row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        //设置边框 黑色 细实线
        let top, left, bottom, right;
        top = left = bottom = right = { style: 'thin', color: { argb: '000000' } };
        cell.border = { top, left, bottom, right };

        //设置标题部分为粗体
        if (rowNumber <= titleRows) { cell.font = { bold: true }; return; }

        //处理数据项里面的日期和字典
        let { type, dict } = columns[colNumber - 1];
        if (type && (cell.value || cell.value == 0)) return;//非日期、字典或值为空的直接返回
        switch (type) {
          case 'date': cell.value = that.parseDate(cell.value); break;
          case 'dict': cell.value = that.parseDict(cell.value.toString(), dict); break;
        }

      });
    });

    this.ctx.set('Content-Type', 'application/vnd.openxmlformats');
    //this.ctx.set('Content-Type', 'application/octet-stream');
    this.ctx.set('Content-Disposition', "attachment;filename*=UTF-8' '" + encodeURIComponent(name) + '.xlsx');
    this.ctx.body = await workbook.xlsx.writeBuffer()
  },
  /* 将所有的行数据转换为json */
  async changeRowsToDict(worksheet) {
    let dataArray = [];
    let keys = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        keys = row.values;
      }
      else {
        let rowDict = {}
        row.eachCell((cell, colNumber) => {
          var value = cell.value;
          if (typeof value == "object") value = value.text;
          rowDict[keys[colNumber]] = value;
        });
        dataArray.push(rowDict);
      }
    });
    return dataArray;
  },

  async importExcel(req) {
    const Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var dataArray = [];
    let postData = [];
    await workbook.xlsx.readFile(req)
    var worksheet = workbook.getWorksheet(1);
    let keys = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        keys = row.values;
      }
      else {
        let rowDict = {}
        row.eachCell((cell, colNumber) => {
          var value = cell.text;
          if (typeof value == "object") value = value.text;
          rowDict[keys[colNumber]] = value;
        });
        dataArray.push(rowDict);
      }
    });
    console.log(JSON.stringify(dataArray));
    return dataArray
    // console.log(JSON.stringify(data));
    //console.log(JSON.stringify(dataArray));
  },
    
  async handleExcel(req) {
    const Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var dataArray = [];
    let postData = [];
    await workbook.xlsx.readFile(req)
    workbook.eachSheet((worksheet, sheetId)=> {
        let data_row ={name:worksheet.name,data:[]}
        let keys = [];
    worksheet.eachRow((row, rowNumber) => {
        let rowDict = {}
          if (rowNumber == 1) {
        keys = row.values;
      }
      else {
        let rowDict = {}
        row.eachCell((cell, colNumber) => {
          var value = cell.text;
          if (typeof value == "object") value = value.text;
          rowDict[keys[colNumber]] = value.trim();
        });
        data_row.data.push(rowDict);
      }
       
    });

        dataArray.push(data_row)
    })
    return dataArray

    /*var worksheet = workbook.getWorksheet(1);
    let keys = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        keys = row.values;
      }
      else {
        let rowDict = {}
        row.eachCell((cell, colNumber) => {
          var value = cell.text;
          if (typeof value == "object") value = value.text;
          rowDict[keys[colNumber]] = value;
        });
        dataArray.push(rowDict);
      }
    });
    console.log(JSON.stringify(dataArray));
    return dataArray
    // console.log(JSON.stringify(data));
    //console.log(JSON.stringify(dataArray));*/

  },
  
  async unique(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a.email) && res.set(a.email, 1))
  },

  async getData(type,workspace_id,page,limit){
      const url = `https://api.tapd.cn/${type}?workspace_id=${workspace_id}&page=${page}&limit=${limit}`;
      const ctx = this.ctx;
      const result = await ctx.curl(url, {
      // 自动解析 JSON response
      dataType: 'json',
      auth:`${this.app.config.api_user}:${this.app.config.api_password}`,
      // 3 秒超时
      timeout: 3000,
    });
      return result;

  },

  async getSingleData(type,workspace_id,id){
      const url = `https://api.tapd.cn/${type}?workspace_id=${workspace_id}&id=${id}`;
      const ctx = this.ctx;
      const result = await ctx.curl(url, {
      // 自动解析 JSON response
      dataType: 'json',
      auth:`${this.app.config.api_user}:${this.app.config.api_password}`,
      // 3 秒超时
      timeout: 3000,
    });
      console.log('getsingle')
      return result;

  },
   async getCount(type,workspace_id){
      const url = `https://api.tapd.cn/${type}/count?workspace_id=${workspace_id}`;
      const ctx = this.ctx;
      const result = await ctx.curl(url, {
      // 自动解析 JSON response
      dataType: 'json',
      auth:`${this.app.config.api_user}:${this.app.config.api_password}`,
      // 3 秒超时
      timeout: 3000,
    });
      return result;
  },
    async getFlow(type,workspace_id){
      const url = `https://api.tapd.cn/workflows/status_map?workspace_id=${workspace_id}`;
      const ctx = this.ctx;
      const result = await ctx.curl(url, {
      // 自动解析 JSON response
      dataType: 'json',
      auth:`${this.app.config.api_user}:${this.app.config.api_password}`,
      // 3 秒超时
      timeout: 3000,
    });
      return result;
  },
 async getUsers(workspace_id){
      const url = `https://api.tapd.cn/workspaces/users?workspace_id=${workspace_id}&fields=user,email`;
      const ctx = this.ctx;
      const result = await ctx.curl(url, {
      // 自动解析 JSON response
      dataType: 'json',
      auth:`${this.app.config.api_user}:${this.app.config.api_password}`,
      // 3 秒超时
      timeout: 3000,
    });
      return result;
  }
  
};


