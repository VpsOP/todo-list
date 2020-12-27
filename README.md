# TodoList

```bash
A TodoList web app made with Mongo, Express , Node, EJS and lots of Love
```

## How it looks

### Default List
<img src="https://github.com/VpsOP/todo-list/blob/master/assets/images/todolist-default.png?raw=true" width="400">

### Make a custom list

<img src="https://github.com/VpsOP/todo-list/blob/master/assets/images/todolist-customname.png?raw=true">


If you entered Shopping in place of {listname}, it will make a list named Shopping like this  

<img src="https://github.com/VpsOP/todo-list/blob/master/assets/images/todolist-shopping.png?raw=true" width="400">


## Database

The app uses mongoose to manage MongoDB database.

There are two Models - Item and List
* ```Item model``` for saving all the items of default list.
* ```List model``` stores all the custom lists. There is a separate document for each custom list and all the items are stored in an array named ```items```.

 
## License
[MIT](https://choosealicense.com/licenses/mit/)
