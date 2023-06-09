const Note = require('../models/note');
const Tag = require('../models/tag');



exports.getIndex = (req, res, next) => {
  const user = req.user;

  user
    .getNotes({
      where: {
        status: 'Approved',
      },
      raw: true,
    })
    .then((result) => {
      res.render('notes/index', {
        pageTitle: 'Notes',
        path: '/',
        notes: result,
        tags: [],
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Note.findAll({
  //   where: {
  //     status: 'Approved',
  //   },
  //   raw: true,
  // })
  //   .then((result) => {
  //     // console.log(result);
  //     res.render('notes/index', {
  //       pageTitle: 'Notes',
  //       path: '/',
  //       notes: result,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getAddNote = (req, res, next) => {
  Tag.findAll().then(tag=>{
    res.render('notes/add-note', {
      pageTitle: 'Add a note',
      path: '/add-note',
      isEditMode: '',
      tags: tag,
      selectedTags: [],
    });
  })
  
};

exports.postNote = (req, res, next) => {
  const reqBody = req.body;
  const { title, description, imageUrl, tagIds } = reqBody;
  const user = req.user;
  console.dir('user', user);
  // magic methods
  user
    .createNote({
      title: title,
      description: description,
      imageUrl: imageUrl,
      status: 'Unapproved',
    })
    .then((_note) => {
      if(tagIds && tagIds.length>0){
        Tag.findAll({
          where:{
            id:tagIds
          }
        }).then(tags =>{
          _note.addTags(tags).then(()=>{
            console.log('tag added successfully');
            res.redirect('/');
          })
        })
      }else{
        res.redirect('/');
      }
      console.log('Record Inserted');
      res.redirect('/');
    })
    .catch((err) => {
      console.log('Failed: Record Inserted');
    });
};

exports.getNoteDetails = (req, res, next) => {
  const noteId = req.params.noteId;
  Note.findOne({
    where: {
      id: noteId,
    },
   
  })
    .then((result) => {
      
      res.render('notes/note', {
        pageTitle: 'View Note Details',
        path: '',
        note: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // find only using Primary key
  // Note.findByPk(noteId, { raw: true })
  //   .then((result) => {
  //     res.render('notes/note', {
  //       pageTitle: 'View Note Details',
  //       path: '',
  //       note: result,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditNoteDetails = (req, res, next) => {
  const noteId = req.params.noteId;
  const isEdit = req.query.isEditing;
  Note.findOne({
    where: {
      id: noteId,
    },
    include:{
      model:Tag,
      as:'Tags',
    }
  })
    .then((_note) => {
      Tag.findAll().then((tags)=>{
        res.render('notes/add-note', {
          pageTitle: 'Editing a note',
          path: '',
          note: _note,
          isEditMode: isEdit,
          tags: tags,
          selectedTags: _note.Tags.map(tag => tag.id)
        });
      })
      
    })
    .catch((err) => {
      console.log(er);
    });
};

exports.saveEditNote = (req, res, next) => {
  const reqBody = req.body;
  const { title, description, imageUrl, noteId , tagIds} = reqBody;
  Note.update(
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
    },
    {
      where: {
        id: noteId,
      },
    }
  )
    .then((result) => {
      Note.findByPk(noteId,{
        include: {
          model:Tag,
          as:'Tags'
        }
      }).then((_note)=>{
        if(tagIds && tagIds.length>0){
          Tag.findAll({
            where:{
              id:tagIds
            }
          }).then(tags=>{
            _note.setTags(tags).then(()=>{
              res.redirect(`/note/${noteId}`);
            })
          })
        }else{
          res.redirect(`/note/${noteId}`);
        }
      })
      
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteNote = (req, res, next) => {
  const noteId = req.body.noteId;
  Note.destroy({
    where: {
      id: noteId,
    },
  })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.filterNotes = (req, res, next) => {
  const user = req.user;
  const tagIds = req.body.tagIds;
  res.render('notes/index', {
    pageTitle: 'Notes',
    path: '/',
    notes: [],
    tags: [],
  });
};