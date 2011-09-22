def growl(message)
  growlnotify = `which growlnotify`.chomp
  if growlnotify
    options = ["-m", message, "starling"]
    system "#{growlnotify} -m \"#{message}\" starling"
  end
end

watch('sass/(.*)\.scss') do
  system 'rake', 'css'
  growl "Sass -> CSS"
end

watch('haml/(.*)\.haml') do
  system 'rake', 'html'
  growl "Haml -> HTML"
end
