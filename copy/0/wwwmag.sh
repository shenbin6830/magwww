prj=magwww
src=/usr/local/zmax/prj/$prj/trunk/www
dest=/opt/mag/static/$prj
act=online_trunk

cd /usr/local/zmax/prj/$prj
svn update

echo "rsync -r --exclude=".svn" --exclude="*.xml" $src/ $dest/"
rsync -r --exclude=".svn" --exclude="*.xml" $src/ $dest/

echo "rsync -r --exclude=".svn" --exclude="*.xml" copy/0/${act}/ $dest/"
rsync -r --exclude=".svn" --exclude="*.xml" /usr/local/zmax/prj/$prj/copy/0/${act}/ $dest/