const mysql = require('mysql2/promise');

const poolConfig = {
    uri: process.env.MYSQL_URI,
    ssl: {
      rejectUnauthorized: false
    }
  };
  
  const pool = mysql.createPool(poolConfig);

exports.getbanner = (req, res) => {
  pool.execute('SELECT * FROM tbl_banner', (err, result) => {
      if (err) {
        return res.json({ status: "error", message: "Error: " + err.message });
      }
      if (result.length === 0) {
        return res.json({ status: "error", message: "No banners found" });
      }
      res.json(result);
    });
  };
  
  // exports.updbanner = (req, res) => {
  //   if (!req.body.BN_id || !req.body.BN_name || !req.body.BN_alt) {
  //     return res.json({ status: "error", message: "Missing required fields" });
  //   }
  
  //   const fileSrc = req.files && req.files.BN_src ? req.files.BN_src[0].path : req.body.BN_src;
  //   const fileCutted = req.files && req.files.BN_cutted ? req.files.BN_cutted[0].path : req.body.BN_cutted;
  
  //   Con.execute('SELECT * FROM tbl_banner WHERE BN_id = ?', [req.body.BN_id], (err, result) => {
  //     if (err) {
  //       console.error("Database Error:", err);
  //       return res.json({ status: "error", message: "Internal Server Error" });
  //     }
  
  //     if (result.length === 0) {
  //       return res.json({ status: "error", message: "Banner not found" });
  //     }
  
  //     Con.execute(
  //       'UPDATE tbl_banner SET BN_name = ?, BN_src = ?, BN_alt = ?, BN_cutted = ? WHERE BN_id = ?',
  //       [req.body.BN_name, fileSrc, req.body.BN_alt, fileCutted, req.body.BN_id],
  //       (err) => {
  //         if (err) {
  //           console.error("Database Error:", err);
  //           return res.json({ status: "error", message: "Internal Server Error" });
  //         }
          
  //         res.json({ status: "success", message: "Banner updated successfully" });
  //       }
  //     );
  //   });
  // };
  