let gulpfile = require("gulp");
let pug = require("gulp-pug");
let sass = require("gulp-sass");
let browserSync = require("browser-sync").create();

gulpfile.task("build:pug", () => {
  return gulpfile
    .src("src/pug/*.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulpfile.dest("build"));
});

gulpfile.task("build:scss", () => {
  return gulpfile
    .src("src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpfile.dest("build/css"));
});

gulpfile.task("build:resources", () => {
  return gulpfile
    .src("src/resources/**/*", {
      dot: true,
      allowEmpty: true,
    })
    .pipe(gulpfile.dest("build"));
});

gulpfile.task(
  "build",
  gulpfile.parallel(
    "build:pug",
    "build:scss",
    "build:resources"
  )
);

gulpfile.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });
});

gulpfile.task("watch", () => {
  gulpfile.watch("src/pug/**/*.pug", gulpfile.series("build:pug"));
  gulpfile.watch("src/scss/**/*.scss", gulpfile.series("build:scss"));
  gulpfile.watch(
    ["src/resources/**/*", "src/resources/**/.*"],
    gulpfile.series("build:resources")
  );
  gulpfile.watch("build/**/*").on("change", browserSync.reload);
});

gulpfile.task(
  "default",
  gulpfile.series("build", gulpfile.parallel("serve", "watch"))
);
