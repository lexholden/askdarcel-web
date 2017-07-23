let AskDarcelClient = require('./AskDarcelClient');
let darcel = new AskDarcelClient('http://localhost:8080/api');

function approveChangeRequests() {
  let changeRequestLookup = {};
  return darcel.signIn('dev-admin@sheltertech.org', 'dev-test-01')
    .then((d) => {
      return darcel.getData('/change_requests');
    })
    .then((d) => {
      let { data } = d;

      data.change_requests.forEach((changeRequest, i) => {
        let objectId = changeRequest.object_id;

        if (changeRequestLookup[objectId] === undefined) {
          changeRequestLookup[objectId] = {};
        }

        let resourceChanges = changeRequestLookup[objectId]

        changeRequest.field_changes.forEach((fieldChange, i) => {
          let { field_name, field_value } = fieldChange;
          if (resourceChanges[field_name]) {
            console.log('There are conflicting changes for', objectId, field_name);
            changeRequest.valid = false
          } else {
            resourceChanges[field_name] = field_value;
          }
        });
      });

      // const actionItems = data.change_requests.reduce((actions, changeRequest, i) => {
      //   // console.log(changeRequest);
      //   if (changeRequestLookup[changeRequest.object_id] === undefined) {
      //     changeRequestLookup[changeRequest.object_id] = [];
      //   }

      //   if (i < 1000) {
      //     actions.push(changeRequest);
      //     changeRequestLookup[changeRequest.object_id] =
      //       changeRequestLookup[changeRequest.object_id].concat(changeRequest.field_changes);
      //   }
      //   // change
      //   // changeRequestLookup
      //   return actions;
      // }, []);

      // // console.log(actionItems);
      // return Promise.all(actionItems.reduce().map((item, i) => {
      //   if (changeRequestLookup[item.object_id].length > 1) {
      //     console.log('a resource has multiple change requests', item.resource.name);
      //     return Promise.resolve('duplicate');
      //   }
      //   let body = item.field_changes.reduce((requestBody, change) => {
      //     requestBody[change.field_name] = change.field_value;
      //     return requestBody;
      //   }, {});
      //   return Promise.resolve(item.resource.name);
      //   // console.log({ body, changes: item.field_changes, resource: item.resource });
      //   return darcel.postData(`/change_requests/${item.id}/approve`, body);
      // }));
    })
    .then((d) => {
      console.log(JSON.stringify(d));
    })
    .catch((e) => {
      console.log(e);
    });
}

approveChangeRequests();
