const form = document.querySelector("#takevalue");
const API_URL = 'http://zammad.mbaza.local'; //https://crm.mbaza.dev.cndp.org.rw
const API_TOKEN = 'ELhN-hUQORaUL1I8be9Gy3pjLyOGCEReZDgErAJZIXeU4mzETNTvcuc5PUn5l0Wf';
// this Files is a global variable to store files added 
var Files = []
function validationform() {
  const firstName = document.querySelector("#firstname")?.value;
  const otherName = document.querySelector("#othernames")?.value;
  const nationId = document.querySelector("#nationid")?.value;
  const phoneNumber = document.querySelector("#phonenumber")?.value;
  const visitoremail = document.querySelector("#visitoremail")?.value;
  const provinceName = document.querySelector("#provincename")?.value;
  const sectorName = document.querySelector("#sectorname")?.value;
  const districtName = document.querySelector("#districtname")?.value;
  const cellName = document.querySelector("#cellname")?.value;
  const villageName = document.querySelector("#villagename")?.value;
  const visitorMessage = document.querySelector("#visitormessage")?.value;

  const ferror = document.querySelector("#error-fname");
  const lerror = document.querySelector("#error-othername");
  const iderror = document.querySelector("#error-nationid");
  const phonerror = document.querySelector("#error-phonenumber");
  const emailerror = document.querySelector("#error-email")
  const provinceerror = document.querySelector("#error-province");
  const sectorerror = document.querySelector("#error-sector");
  const districterror = document.querySelector("#error-district");
  const cellerror = document.querySelector("#error-cell");
  const villageerror = document.querySelector("#error-village")
  const messageerror = document.querySelector("#error-message");

  const file = document.querySelector("#filename");

  let isValid = true;

  if (!firstName || firstName.trim() === "") {
    ferror.innerHTML = "Uzuzamo izina ribanza";
    isValid = false;
  } else {
    ferror.innerHTML = "";
  }
  if (!otherName || otherName.trim() === "") {
    lerror.innerHTML = "Uzuzamo irindi zina";
    isValid = false;
  } else {
    lerror.innerHTML = "";
  }
  if (!nationId || nationId.trim() === "") {
    iderror.innerHTML = "Uzuzamo indangamuntu";
    isValid = false;
  } else {
    iderror.innerHTML = "";
  }
  if (!phoneNumber || phoneNumber.trim() === "") {
    phonerror.innerHTML = "Uzuzamo telefone";
    isValid = false;
  } else {
    phonerror.innerHTML = "";
  }
  if (!provinceName || provinceName.trim() === "") {
    provinceerror.innerHTML = "Uzuzamo Intara";
    isValid = false;
  } else {
    provinceerror.innerHTML = "";
  }
  if (!sectorName || sectorName.trim() === "") {
    sectorerror.innerHTML = "Uzuzamo imeri";
    isValid = false;
  } else {
    sectorerror.innerHTML = "";
  }
  if (!districtName || districtName.trim() === "") {
    districterror.innerHTML = "Uzuzamo akarere";
    isValid = false;
  } else {
    districterror.innerHTML = "";
  }
  if (!cellName || cellName.trim() === "") {
    cellerror.innerHTML = "Uzuzamo akarere";
    isValid = false;
  } else {
    cellerror.innerHTML = "";
  }
  if (!villageName || villageName.trim() === "") {
    villageerror.innerHTML = "Uzuzamo akarere";
    isValid = false;
  } else {
    villageerror.innerHTML = "";
  }
  if (!visitorMessage || visitorMessage.trim() === "") {
    messageerror.innerHTML = "Uzuzamo ubutumwa";
    isValid = false;
  } else {
    messageerror.innerHTML = "";
  }



  if (isValid) {
    const signinUrl = `${API_URL}/api/v1/users`;
    const params = {
      firstname: firstName,
      lastname: otherName,
      email: `${phoneNumber}@email.com`,
      password: phoneNumber,
      login: "jdoe",
      roles: ["Customer"],
      group_ids: {
        2: ["create"],
      },
    };

    const ticketUrl = `${API_URL}/api/v1/tickets`;
    const addTag = `${API_URL}/api/v1/tags/add`;
    const queryUser = `${API_URL}/api/v1/users/search?query=${params.email}@email.com&limit=1`;


    (async () => {
      const loaderEl = document.querySelector("#loading");
      try {
        loaderEl.innerHTML = "Mutegereze...";

        const { data: users } = await axios.get(queryUser, {
          headers: {
            Authorization:
              `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        let user = users[0];

        if (!user) {
          const { data } = await axios.post(signinUrl, params, {
            headers: {
              Authorization:
                `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          });
          user = data;
        }

        const ticketParams = {
          title: `${firstName} ${otherName}-${phoneNumber}`,
          group_id: 2,
          customer: `${phoneNumber}@email.com`,
          article: {
            subject: "Website form ticket",
            body: `Name: ${firstName} ${otherName}\nID: ${nationId}\nTel: ${phoneNumber}\nProvince: ${provinceName}\nDistrict: ${districtName}\nSector: ${sectorName}\nCell: ${cellName}\nVillage: ${villageName}\n\n${visitorMessage}`,
            type: "note",
            internal: false,
          },
        };

        const { data: res } = await axios.post(ticketUrl, ticketParams, {
          auth: {
            username: `${phoneNumber}@email.com`,
            password: `${phoneNumber}`,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });


        const ticketID = res.id;
        const tagParams = {
          object: "Ticket",
          o_id: `${ticketID}`,
          item: `${districtName}`,
        };
        const { data1: res1 } = await axios.post(addTag, tagParams, {
          auth: {
            username: `${phoneNumber}@email.com`,
            password: `${phoneNumber}`,
          },
          headers: {

            "Content-Type": "application/json",
          },
        });

        const tagParams2 = {
          object: "Ticket",
          o_id: `${ticketID}`,
          item: `${provinceName}`,
        };

        const { data1: res2 } = await axios.post(addTag, tagParams2, {
          auth: {
            username: `${phoneNumber}@email.com`,
            password: `${phoneNumber}`,
          },
          headers: {

            "Content-Type": "application/json",
          },
        });

        const tagParams3 = {
          object: "Ticket",
          o_id: `${ticketID}`,
          item: `${sectorName}`,
        };

        const { data1: res3 } = await axios.post(addTag, tagParams3, {
          auth: {
            username: `${phoneNumber}@email.com`,
            password: `${phoneNumber}`,
          },
          headers: {

            "Content-Type": "application/json",
          },
        });
        // send files 

        let dataObj = {
          ticket_id: ticketID,
          to: "",
          cc: "",
          subject: "some subject",
          body: "Please see attached file...",
          content_type: "text/plain",
          type: "note",
          internal: true,
          time_unit: "25",
          attachments: Files
        };
        const sendFiles = async () => {
          const { data: res } = await axios.post(articleUrl, dataObj, {
            auth: {
              username: `${phoneNumber}@email.com`,
              password: `${phoneNumber}`,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        // check if any files added
        if (file.files.length > 0) {
          sendFiles();
        }



        loaderEl.innerHTML = "";

        form.reset();

        if (res) {
          window.location.href = "./feedback.html";
        }
      } catch (error) {
        loaderEl.innerHTML = "";
        alert(error?.message);
      }
    })();
  }
}



/* 
   codes for province, district, sector, cell and village exchange selection

*/

let Data = '';
const province = document.querySelector("#provincename");
const district = document.querySelector('#districtname');
const sector = document.querySelector("#sectorname");
const cell = document.querySelector("#cellname");
const village = document.querySelector("#villagename");
const articleUrl = `${API_URL}/api/v1/ticket_articles`;


let dt = '';
(async () => {
  dt = await fetch('./data.json');
  dt = await dt.json();
})();

let provObj = '';
let emptyTag = `< option value = "" ></> `;
province.addEventListener("change", () => {
  if (province.value == "") {
    district.innerHTML = emptyTag;
    sector.innerHTML = emptyTag;
    cell.innerHTML = emptyTag;
    village.innerHTML = emptyTag;
  }
  provObj = dt[province.value];
  let prov = Object.keys(dt[province.value]);
  let optionHtml = generateHTML(prov, dt[province.value]);
  district.innerHTML = optionHtml;

  sector.innerHTML = emptyTag;
  cell.innerHTML = emptyTag;
  village.innerHTML = emptyTag;
})

let distrObj = '';
district.addEventListener("change", () => {

  if (district.value == "") {
    sector.innerHTML = emptyTag;
    cell.innerHTML = emptyTag;
    village.innerHTML = emptyTag;
  }

  let distr = Object.keys(provObj[district.value]);
  distrObj = provObj[district.value];
  let optionHtml = generateHTML(distr, distrObj);
  sector.innerHTML = optionHtml;

  cell.innerHTML = emptyTag;
  village.innerHTML = emptyTag;
});

let cellObj = '';
sector.addEventListener("change", () => {

  if (sector.value == "") {
    cell.innerHTML = emptyTag;
    village.innerHTML = emptyTag;
  }

  let cll = Object.keys(distrObj[sector.value]);
  cellObj = distrObj[sector.value];
  let optionHtml = generateHTML(cll, cellObj);
  cell.innerHTML = optionHtml;

  village.innerHTML = emptyTag;
});

cell.addEventListener("change", () => {

  if (cell.value == "") {
    village.innerHTML = emptyTag;
  }

  let vill = Object.keys(cellObj[cell.value]);
  villageObj = cellObj[cell.value];
  let optionHtml = generateHTML(villageObj, villageObj);
  village.innerHTML = optionHtml;
});


const generateHTML = (arrList, Obj) => {
  let output = `<option value=""> --Hitamo --</option>`;
  arrList.map((item) => {
    output += `<option value='${item}'> ${item}</option>`;
  });
  return output;
}

const file = document.querySelector("#filename");


file.addEventListener("change", () => {
  for (let i = 0; i < file.files.length; i++) {
    Files.push(file.files[i]);
  }
});

var inputs = document.querySelectorAll('.fileclass');
Array.prototype.forEach.call(inputs, function (input) {
  var label = input.nextElementSibling;
  let labelVal = label.innerHTML;

  input.addEventListener('change', function (e) {
    var fileName = '';
    if (this.files && this.files.length > 1)
      fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
    else
      fileName = input.files[0].name;

    if (fileName) {
      if (fileName.length > 15) {
        label.innerHTML = fileName.slice(0, 15) + '...' + fileName.slice(-5);

      }
      else {
        label.innerHTML = fileName;
      }
    }
    else {

      label.innerHTML = "something wrong";
    }
  });
});




form.addEventListener("submit", (event) => {
  event.preventDefault();
  validationform();
});

