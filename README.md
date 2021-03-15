관계설정

User -> Post
 사람 1명이 게시글을 여러개 쓸 수 있다.


hasMany -> 예를들어 1명이 게시글을 여러개 쓸때 User에 적어준다.
belongsTo -> 예를들어 게시글은 작성자에게 속해있다.


즉
belongsTo => FK를 생성해준다.

1 대 다 => hasMany / belongsTo
다 대 다 => belongsToMany
1 대 1 => hasOne