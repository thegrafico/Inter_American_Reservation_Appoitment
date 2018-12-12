var express = require('express')											 //requirements for the code
var router = express.Router()													 //requirements for the code
var roleCheckHelper = require('../../helpers/roleCheck'); //path for the roleCheck
var db = require("../../helpers/mysqlConnection").mysql_pool;

router.get('/', function (req, res) {	//requirements for the code

	const userName = req.cookies.graph_user_name;
	const email = req.cookies.graph_user_email;

	roleCheckHelper.roleCheck('A', email, userName, function(pass){					//checks if the roleID matches the dbRoleID

		if(pass == true){																											//if the roleID's matches run the indexProf

			var layout = './Super_Admin/indexSAdmin'; /* ==== Missing! ==== */											/* === Missing! === */
		  let parms = { title: 'adminRoom	', active: { home: true }, urlManageRoom: '/superAdminHome/manageRoom', urlManageRole: '/superAdminHome/manageRole'};

			let getStats = `Select *
			FROM (Select count(status) count, status from ResDecline natural join
			(select distinct(roomID) from Rooms natural join  (select userID, deptID from Users natural join DeptManagers) as DUsers where userID = 1) UReservations
			group by status) ResDecline2
			union all
			(select count(status),status from Reservation natural join
			(select distinct(roomID) from Rooms natural join  (select userID, deptID from Users natural join DeptManagers) as DUsers where userID = 1) UReservations
			group by status)
			order by status;`

			db.getConnection(function (err, connection) {
				if (err) throw error;
				connection.query (getStats, function (err, results, fields){

					parms.accepted = results[0].count;
					parms.decline	 = results[1].count;
					parms.pending	 = results[2].count;

					parms.user = userName;
					res.render(layout, parms);
				})
				connection.release();
			})
		}

		else{
			res.redirect('/home');				//if the roleID's don't match redirects to indexStud
		}

	});
});

module.exports = router;						//requirements for the code
