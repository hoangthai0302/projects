document.addEventListener('DOMContentLoaded', event => {


    const app = firebase.app();
    const db = firebase.firestore();
    const myPost = db.collection('posts').doc('firstpost');

    myPost.onSnapshot(doc => {

        const data = doc.data();
        document.querySelector('#title').innerHTML = data.title;
    })

    const employeeRef = db.collection('employees')
                            //where trường name thì bắt buộc phải orderBy trường name
                            //nếu orderBy trường khác sẽ văng lỗi
                            .where('age', '<', 35)
                            .orderBy('age')
                            .limit(20)
                            //do đó muốn orderBy trường name thì phải làm phía client
    const query = employeeRef;

    query.get()
         .then(employees => {
             printTable('employee', employees, [
                 {
                     title: 'Name',
                     key: 'name'
                 },
                 {
                     title: 'Age',
                     key: 'age'
                 }
             ]);
         })
         .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

});

function updatePost(e) {
    const db = firebase.firestore();
    const myPost = db.collection('posts').doc('firstpost');
    myPost.update({ title: e.target.value });
}















//util functions
function printTable(id, collection, columns) {
    var table = document.getElementById(id);
    if(!table) {
        table = create('table');
        table.id = id;
        document.body.appendChild(table);
    }

    empty(id);
    var thead = create('thead');
    table.appendChild(thead);
    var trh = create('tr');
    thead.appendChild(trh);
    var tbody = create('tbody');
    table.appendChild(tbody);

    columns.forEach(col => {
        var th = create('th');
        th.innerHTML = col.title;
        trh.appendChild(th);
    })

    collection.forEach(doc => {

        var data = doc.data();
        var tr = create('tr');
        columns.forEach(column => {
            var td = create('td');
            td.innerHTML = data[column.key];
            tr.appendChild(td);
        })
        table.appendChild(tr);
    })
}

function create(tag) {
    return document.createElement(tag);
}

function empty(id) {
    var node = document.getElementById(id);
    if(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
         }
    }
}