const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//1....get all player details
app.get("/players/", async (req, res) => {
  const getPlayers = `SELECT
      *
    FROM  
      cricket_team`;
  const players = await db.all(getPlayers);
  res.send(players);
});

//2.....post a player into database
app.post("/players/", async (req, res) => {
  const playerDetails = req.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addplayer = `
    INSERT INTO
      cricket_team (playerName,jerseyNumber,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role},
         
      );`;

  const dbResponse = await db.run(addplayer);
  const player_id = dbResponse.lastID;
  response.send("Player Added to Team");
});

//3....get player with playerId

app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const getPlayer = `SELECT
      *
    FROM  
      cricket_team WHERE player_id=${playerId}`;
  const player = await db.get(getPlayer);
  res.send(player);
});

//4.....update a player details
app.put("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const playerDetails = req.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatequery = `UPDATE cricket_team SET
    playerName=${playerName}
    ,jerseyNumber=${jerseyNumber}
    ,role=${role} WHERE player_id=${playerId}`;
  const updateDetails = await db.run(updatequery);
  res.send("Player Details Updated");
});

// 5...... delete a player from table

app.delete("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const deletePlayer = `
    DELETE FROM
cricket_team
    WHERE
      player_id=${playerId};`;
  await db.run(deletePlayer);
  res.send("Player Removed");
});

module.exports = app;
