const list = document.querySelector('ul');
const form = document.querySelector('form');

const addRecipe = (recipe, id) => {
  let time = recipe.created_at.toDate();
  let html = `
    <li data-id="${id}">
      <div>${recipe.tittle}</div>
      <div>${recipe.age}</div>
      <div><small>${time}</small></div>
      <button class= "btn btn-danger btn-sm my-2">Delete</button>
    </li>
  `;

  list.innerHTML += html;
};
//This is a function to remove from DOM
const deleteFromDom = (id) =>{
const recipes = document.querySelectorAll('li');
recipes.forEach(recipe =>{
  if(recipe.getAttribute('data-id') === id){
    recipe.remove();
  }
})
}
// get documents
db.collection('receipt').onSnapshot(snapshot =>{
  snapshot.docChanges().forEach(change => {
   const doc = change.doc;
   if(change.type === 'added'){
     addRecipe(doc.data(),doc.id)
   }else if(change.type ==='removed'){
     deleteFromDom(doc.id);
   } 
  });
})

// save documents
form.addEventListener('submit', e => {
  e.preventDefault();

  function age(){
      return Math.floor(Math.random()* (60-20))+ 20
  }

  const now = new Date();
  const recipe = {
    tittle: form.recipe.value,
    age: age(),
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };

  db.collection('receipt').add(recipe).then(() => {
    console.log('recipe added');
  }).catch(err => {
    console.log(err);
  });
});

//deleting data
list.addEventListener('click',e =>{
  if(e.target.tagName === 'BUTTON'){
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection('receipt').doc(id).delete().then(()=>{
      console.log('Element has been deleted!')
    })

  }
})