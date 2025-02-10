import { renderNavBar } from "./lowRankElements.mjs";
import { PageManager } from "./manager.mjs";
import { RoomSocketManager } from "../socketManager.mjs";
import { clearBody } from "./lowRankElements.mjs";
import { GameLobbyPage } from "./gamelobby.mjs";
import { TournamentPage } from "./tournament.mjs";

export class GameQueuePage {
  static render() {
    renderNavBar();

    document.body.innerHTML += `
        <div style="border: 1px solid gray; margin: 4px;">
          <a id="quitQueueLink" class="btn btn-info mb-3"; style="margin: 4px; text-decoration: none;">Quit queue link</a>
        </div>
        <div id="gameQueueSection">
        </div>
      `;

    const quitQueueLink = document.getElementById("quitQueueLink");
    quitQueueLink.addEventListener("click", (event) => {
      event.preventDefault();
      clearBody();
      RoomSocketManager.disconnect();
      GameLobbyPage.renderAndPushHistory();
    });

    PageManager.currentpageStatus = PageManager.pageStatus.gameQueue;
  }

  static updateQueueMemberSection = () => {
    const gameQueueSection = document.getElementById("gameQueueSection");
    gameQueueSection.innerHTML = "";
    gameQueueSection.style = "border: 1px solid gray; margin: 4px;";

    const queueStatus = document.createElement("p");
    queueStatus.textContent = `${RoomSocketManager.getNumOfParticipants()} / ${
      RoomSocketManager.maxNumOfParticipant
    }`;
    gameQueueSection.appendChild(queueStatus);

    RoomSocketManager.participantList.people.forEach((value) => {
      const participant = document.createElement("div");
      participant.textContent = `user id : ${value.user_id}, user name : ${value.user_name}`;
      gameQueueSection.appendChild(participant);
    });

    console.log(`num : ${typeof(RoomSocketManager.getNumOfParticipants())}`);
    console.log(`max : ${typeof(RoomSocketManager.maxNumOfParticipant)}`);
    if (
      RoomSocketManager.getNumOfParticipants() ===
      RoomSocketManager.maxNumOfParticipant
    ) {
      console.log("congraturation!!!");
      clearBody();

      TournamentPage.render();
    }
  };

  static destroy() {
    const gameQueueSection = document.getElementById("gameQueueSection");
    gameQueueSection.innerHTML = "";
    gameQueueSection.parentNode.removeChild(gameQueueSection);
  }
}
