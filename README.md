관계설정

User -> Post
사람 1명이 게시글을 여러개 쓸 수 있다.

1 대 다
hasMany(1) : belongsTo(다)

다 대 다
belongsToMany

즉
belongsTo => FK를 생성해준다.

1 대 다 => hasMany / belongsTo
다 대 다 => belongsToMany
1 대 1 => hasOne
