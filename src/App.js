import React, { useState } from 'react'; 

import { Camera, Search, X } from 'lucide-react'; 

import { Button } from "@/components/ui/button"; 

import { Input } from "@/components/ui/input"; 

import { Switch } from "@/components/ui/switch"; 

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 

import { Dialog, DialogContent } from "@/components/ui/dialog"; 

import { Card, CardContent } from "@/components/ui/card"; 

 

// TimePicker component (identique au précédent) 

const TimePicker = ({ value = "00:00", onSelect, onClose }) => { 

  const [selectedTime, setSelectedTime] = useState(value); 

  const [view, setView] = useState('hours'); 

  const radius = view === 'hours' ? 110 : 110; 

 

  const handleClockClick = (e) => { 

    const rect = e.currentTarget.getBoundingClientRect(); 

    const centerX = rect.width / 2; 

    const centerY = rect.height / 2; 

    const x = e.clientX - rect.left - centerX; 

    const y = centerY - (e.clientY - rect.top); 

    const distance = Math.sqrt(x * x + y * y); 

    let angle = Math.atan2(x, y) * 180 / Math.PI; 

    if (angle < 0) angle += 360; 

 

    const [currentHours, currentMinutes] = selectedTime.split(':').map(Number); 

    let newTime = selectedTime; 

 

    if (view === 'hours') { 

      const isInnerCircle = distance < radius * 0.7; 

      let hours = Math.round(angle / 30); 

      if (isInnerCircle) { 

        hours = hours === 0 ? 0 : hours + 12; 

      } else { 

        hours = hours === 0 ? 12 : hours; 

      } 

      newTime = `${String(hours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`; 

      setSelectedTime(newTime); 

      setView('minutes'); 

    } else { 

      const minutes = Math.round(angle / 6) % 60; 

      newTime = `${String(currentHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; 

      setSelectedTime(newTime); 

    } 

  }; 

 

  return ( 

    <Dialog open onOpenChange={onClose}> 

      <DialogContent className="p-0"> 

        <div className="bg-purple-900 p-4"> 

          <div className="text-white text-3xl text-center">{selectedTime}</div> 

        </div> 

 

        <div className="p-8"> 

          <div className="relative w-64 h-64 mx-auto"> 

            <div  

              className="absolute inset-0 rounded-full bg-gray-100" 

              onClick={handleClockClick} 

            > 

              {view === 'hours' ? ( 

                <> 

                  {[...Array(12)].map((_, i) => { 

                    const hour = i === 0 ? 12 : i; 

                    const angle = (i * 30 - 90) * (Math.PI / 180); 

                    const x = 128 + radius * Math.cos(angle); 

                    const y = 128 + radius * Math.sin(angle); 

 

                    return ( 

                      <div 

                        key={hour} 

                        className="absolute -translate-x-1/2 -translate-y-1/2 text-gray-600" 

                        style={{ 

                          left: `${x}px`, 

                          top: `${y}px`, 

                        }} 

                      > 

                        {String(hour).padStart(2, '0')} 

                      </div> 

                    ); 

                  })} 

                  {[...Array(12)].map((_, i) => { 

                    const hour = i === 0 ? 0 : i + 12; 

                    const angle = (i * 30 - 90) * (Math.PI / 180); 

                    const innerRadius = radius * 0.6; 

                    const x = 128 + innerRadius * Math.cos(angle); 

                    const y = 128 + innerRadius * Math.sin(angle); 

 

                    return ( 

                      <div 

                        key={hour} 

                        className="absolute -translate-x-1/2 -translate-y-1/2 text-gray-600" 

                        style={{ 

                          left: `${x}px`, 

                          top: `${y}px`, 

                        }} 

                      > 

                        {String(hour).padStart(2, '0')} 

                      </div> 

                    ); 

                  })} 

                </> 

              ) : ( 

                [...Array(12)].map((_, i) => { 

                  const minute = i * 5; 

                  const angle = (i * 30 - 90) * (Math.PI / 180); 

                  const x = 128 + radius * Math.cos(angle); 

                  const y = 128 + radius * Math.sin(angle); 

 

                  return ( 

                    <div 

                      key={i} 

                      className="absolute -translate-x-1/2 -translate-y-1/2 text-gray-600" 

                      style={{ 

                        left: `${x}px`, 

                        top: `${y}px`, 

                      }} 

                    > 

                      {String(minute).padStart(2, '0')} 

                    </div> 

                  ); 

                }) 

              )} 

            </div> 

          </div> 

        </div> 

 

        <div className="p-4 border-t flex justify-end gap-2"> 

          <Button variant="outline" onClick={onClose}>ANNULER</Button> 

          <Button  

            className="bg-purple-900" 

            onClick={() => { 

              onSelect(selectedTime); 

              onClose(); 

            }} 

          > 

            OK 

          </Button> 

        </div> 

      </DialogContent> 

    </Dialog> 

  ); 

}; 

 

// ProjectSelector component 

const ProjectSelector = ({ onSelect, onClose }) => { 

  const [searchTerm, setSearchTerm] = useState(''); 

   

  const projects = [ 

    { id: 1, name: 'Chantier 1', location: 'Sion' }, 

    { id: 2, name: 'Chantier 3', location: 'Verbier' } 

  ]; 

 

  const filteredProjects = projects.filter(project =>  

    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 

    project.location.toLowerCase().includes(searchTerm.toLowerCase()) 

  ); 

 

  return ( 

    <Dialog open onOpenChange={onClose}> 

      <DialogContent className="p-4"> 

        <div className="mb-4"> 

          <Input 

            placeholder="Rechercher un chantier..." 

            value={searchTerm} 

            onChange={(e) => setSearchTerm(e.target.value)} 

            className="mb-4" 

          /> 

          {filteredProjects.map(project => ( 

            <Button 

              key={project.id} 

              variant="ghost" 

              className="w-full justify-start mb-2" 

              onClick={() => { 

                onSelect(project); 

                onClose(); 

              }} 

            > 

              {project.name} ({project.location}) 

            </Button> 

          ))} 

        </div> 

        <div className="flex justify-end gap-2"> 

          <Button variant="outline" onClick={() => { 

            onSelect(null); 

            onClose(); 

          }}> 

            EFFACER 

          </Button> 

          <Button variant="outline" onClick={onClose}> 

            ANNULER 

          </Button> 

        </div> 

      </DialogContent> 

    </Dialog> 

  ); 

}; 

 

// Main TimeEntryForm component 

const TimeEntryForm = () => { 

  const [startTime, setStartTime] = useState('07:30'); 

  const [endTime, setEndTime] = useState('12:00'); 

  const [isFullDay, setIsFullDay] = useState(false); 

  const [hasLunch, setHasLunch] = useState(false); 

  const [workInfo, setWorkInfo] = useState(''); 

  const [selectedProject, setSelectedProject] = useState(null); 

  const [showTimePicker, setShowTimePicker] = useState(false); 

  const [showProjectSelector, setShowProjectSelector] = useState(false); 

  const [activeTimeField, setActiveTimeField] = useState(null); 

 

  const handleTimeClick = (field) => { 

    setActiveTimeField(field); 

    setShowTimePicker(true); 

  }; 

 

  const handleTimeSelect = (time) => { 

    if (activeTimeField === 'start') { 

      setStartTime(time); 

    } else { 

      setEndTime(time); 

    } 

    setShowTimePicker(false); 

  }; 

 

  const handleSave = () => { 

    // Validation et calcul de la durée 

    if (!selectedProject) { 

      return; 

    } 

 

    const [startHours, startMinutes] = startTime.split(':').map(Number); 

    const [endHours, endMinutes] = endTime.split(':').map(Number); 

    const durationInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes); 

    const hours = Math.floor(durationInMinutes / 60); 

    const minutes = durationInMinutes % 60; 

    const duration = `${hours}:${String(minutes).padStart(2, '0')}`; 

 

    console.log({ 

      startTime, 

      endTime, 

      duration, 

      project: selectedProject, 

      isFullDay, 

      hasLunch, 

      workInfo 

    }); 

  }; 

 

  return ( 

    <div className="fixed inset-0 bg-white"> 

      <header className="bg-white border-b px-4 py-2 flex items-center"> 

        <Button variant="ghost" size="icon"> 

          <X className="h-5 w-5" /> 

        </Button> 

        <h1 className="ml-4 text-lg font-medium">Aujourd'hui</h1> 

      </header> 

 

      <Tabs defaultValue="hours" className="w-full"> 

        <TabsList className="w-full rounded-none border-b"> 

          <TabsTrigger value="hours" className="flex-1">HEURES</TabsTrigger> 

          <TabsTrigger value="absence" className="flex-1">ABSENCE</TabsTrigger> 

        </TabsList> 

 

        <TabsContent value="hours" className="p-4 space-y-4"> 

          <div className="flex items-center justify-between"> 

            <span className="text-sm">Jour entier</span> 

            <Switch  

              checked={isFullDay} 

              onCheckedChange={(checked) => { 

                setIsFullDay(checked); 

                if (checked) { 

                  setStartTime('08:00'); 

                  setEndTime('17:00'); 

                } 

              }} 

            /> 

          </div> 

 

          <div className="space-y-4"> 

            <div> 

              <label className="text-sm text-gray-600 mb-1 block">Début</label> 

              <Button 

                variant="outline" 

                className="w-full justify-between" 

                onClick={() => handleTimeClick('start')} 

                disabled={isFullDay} 

              > 

                {startTime} 

              </Button> 

            </div> 

 

            <div> 

              <label className="text-sm text-gray-600 mb-1 block">Fin</label> 

              <Button 

                variant="outline" 

                className="w-full justify-between" 

                onClick={() => handleTimeClick('end')} 

                disabled={isFullDay} 

              > 

                {endTime} 

              </Button> 

            </div> 

          </div> 

 

          <div> 

            <label className="text-sm text-gray-600 mb-1 block">Chantier</label> 

            <div className="flex gap-2"> 

              <Button 

                variant="outline" 

                className="w-full justify-between text-left" 

                onClick={() => setShowProjectSelector(true)} 

              > 

                {selectedProject  

                  ? `${selectedProject.name} (${selectedProject.location})` 

                  : 'Sélectionner un chantier' 

                } 

              </Button> 

              <Button  

                variant="ghost"  

                size="icon" 

                onClick={() => setShowProjectSelector(true)} 

              > 

                <Search className="h-4 w-4" /> 

              </Button> 

            </div> 

          </div> 

 

          <Card> 

            <CardContent className="p-4"> 

              <div className="flex items-center justify-between mb-2"> 

                <span className="text-sm">Infos sur le travail</span> 

                <div className="flex gap-2"> 

                  <Button variant="ghost" size="icon"> 

                    <Camera className="h-4 w-4" /> 

                  </Button> 

                  <Button  

                    variant="ghost"  

                    size="icon" 

                    onClick={() => setWorkInfo('')} 

                  > 

                    <X className="h-4 w-4" /> 

                  </Button> 

                </div> 

              </div> 

              <Input 

                placeholder="Ajouter des informations..." 

                value={workInfo} 

                onChange={(e) => setWorkInfo(e.target.value)} 

                className="mt-2" 

              /> 

            </CardContent> 

          </Card> 

 

          <div className="flex items-center justify-between"> 

            <span className="text-sm">Repas</span> 

            <Switch  

              checked={hasLunch} 

              onCheckedChange={setHasLunch} 

            /> 

          </div> 

 

          <Button  

            className="w-full bg-purple-900 hover:bg-purple-800 text-white mt-8" 

            onClick={handleSave} 

          > 

            ENREGISTRER 

          </Button> 

        </TabsContent> 

      </Tabs> 

 

      {showTimePicker && ( 

        <TimePicker 

          value={activeTimeField === 'start' ? startTime : endTime} 

          onSelect={handleTimeSelect} 

          onClose={() => setShowTimePicker(false)} 

        /> 

      )} 

 

      {showProjectSelector && ( 

        <ProjectSelector 

          onSelect={setSelectedProject} 

          onClose={() => setShowProjectSelector(false)} 

        /> 

      )} 

    </div> 

  ); 

}; 

 

export default TimeEntryForm; 